#!/usr/bin/env -S node --experimental-strip-types
/**
 * wiki-crawl: discover and cache the full mechanic/content surface of
 * minecraft.wiki into /docs/wiki-cache/.
 *
 * Strategy:
 *   1. Start from a fixed seed of root categories covering mechanics,
 *      blocks, items, mobs, structures, biomes, redstone, enchantments,
 *      dimensions, etc.
 *   2. Use the MediaWiki action=query&list=categorymembers API to walk
 *      each root + sub-categories (bounded depth).
 *   3. Filter to mainspace (ns=0) content pages — skip Talk:, User:, File:.
 *   4. Fetch each page via the existing raw-wikitext path with polite
 *      UA, exponential backoff, idempotent cache.
 *   5. Persist a crawl-state file so interrupted runs resume where they
 *      left off.
 *
 * Invocation:
 *   npm run wiki:crawl                 # full crawl
 *   npm run wiki:crawl -- --resume     # continue from state
 *   npm run wiki:crawl -- --no-categories  # only refresh already-known pages
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');
const CACHE_DIR = join(REPO_ROOT, 'docs', 'wiki-cache');
const STATE_PATH = join(REPO_ROOT, 'docs', 'wiki-cache', '.crawl-state.json');
const WIKI_BASE = 'https://minecraft.wiki';
const USER_AGENT =
  'webmc-wiki-crawl/0.0 (clean-room reimplementation; https://github.com/ajmr/webmc; behavioral-reference only)';

const CATEGORY_DEPTH = 2;
const INTER_REQUEST_MS = 350;
const API_TIMEOUT_MS = 25_000;

// Expansive root-category list. We intentionally pick broad umbrellas;
// walking depth 2 from these pulls in the long tail.
const ROOT_CATEGORIES: readonly string[] = [
  'Category:Blocks',
  'Category:Items',
  'Category:Mechanics',
  'Category:Technical',
  'Category:Mobs',
  'Category:Passive_mobs',
  'Category:Neutral_mobs',
  'Category:Hostile_mobs',
  'Category:Bosses',
  'Category:Biomes',
  'Category:Structures',
  'Category:Generated_structures',
  'Category:Natural_blocks',
  'Category:Ore_blocks',
  'Category:Redstone',
  'Category:Redstone_components',
  'Category:Food',
  'Category:Tools',
  'Category:Weapons',
  'Category:Armor',
  'Category:Potions',
  'Category:Enchantments',
  'Category:Status_effects',
  'Category:Plants',
  'Category:Liquids',
  'Category:The_Nether',
  'Category:The_End',
  'Category:The_Overworld',
  'Category:Dimensions',
  'Category:Villages',
  'Category:World_generation',
  'Category:Gameplay',
  'Category:Non-solid_blocks',
  'Category:Manufactured_blocks',
  'Category:Stone_blocks',
  'Category:Dirt-like_blocks',
  'Category:Wood_blocks',
  'Category:Mineral_blocks',
  'Category:Decorative_blocks',
  'Category:Light_sources',
  'Category:Tile_entities',
  'Category:Containers',
  'Category:Transportation',
  'Category:Horses',
];

interface CrawlState {
  discoveredPages: string[];
  visitedCategories: string[];
  fetchedSlugs: string[];
  lastRunAt: string;
  errors: { slug: string; message: string }[];
}

interface ApiCategoryMember {
  pageid: number;
  ns: number;
  title: string;
}

interface ApiResponse {
  query?: {
    categorymembers?: ApiCategoryMember[];
  };
  continue?: Record<string, string>;
}

function slugify(title: string): string {
  return title.replace(/ /g, '_');
}

function cachePath(slug: string): string {
  return join(CACHE_DIR, `${slug}.wikitext`);
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function loadState(): Promise<CrawlState> {
  if (!existsSync(STATE_PATH)) {
    return {
      discoveredPages: [],
      visitedCategories: [],
      fetchedSlugs: [],
      lastRunAt: '',
      errors: [],
    };
  }
  try {
    const raw = await readFile(STATE_PATH, 'utf8');
    return JSON.parse(raw) as CrawlState;
  } catch {
    return {
      discoveredPages: [],
      visitedCategories: [],
      fetchedSlugs: [],
      lastRunAt: '',
      errors: [],
    };
  }
}

async function saveState(state: CrawlState): Promise<void> {
  await mkdir(dirname(STATE_PATH), { recursive: true });
  state.lastRunAt = new Date().toISOString();
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}

async function apiQuery(params: Record<string, string>, attempt = 1): Promise<ApiResponse> {
  const url = new URL(`${WIKI_BASE}/api.php`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: controller.signal,
    });
    if (res.status === 429 || res.status >= 500) {
      if (attempt < 4) {
        const backoff = 1500 * 2 ** (attempt - 1) + Math.random() * 500;
        await sleep(backoff);
        return await apiQuery(params, attempt + 1);
      }
    }
    if (!res.ok) throw new Error(`api http ${String(res.status)}`);
    return (await res.json()) as ApiResponse;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCategoryMembers(category: string): Promise<ApiCategoryMember[]> {
  const members: ApiCategoryMember[] = [];
  let cont: Record<string, string> = {};
  for (;;) {
    const resp = await apiQuery({
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmlimit: '500',
      cmtype: 'page|subcat',
      ...cont,
    });
    const batch = resp.query?.categorymembers ?? [];
    for (const m of batch) members.push(m);
    if (!resp.continue) break;
    cont = resp.continue;
    await sleep(INTER_REQUEST_MS);
  }
  return members;
}

async function walkCategories(
  roots: readonly string[],
  maxDepth: number,
  state: CrawlState,
): Promise<Set<string>> {
  const discovered = new Set<string>(state.discoveredPages);
  const queue: { cat: string; depth: number }[] = roots.map((c) => ({ cat: c, depth: 0 }));
  const visited = new Set<string>(state.visitedCategories);
  while (queue.length > 0) {
    const next = queue.shift();
    if (!next) break;
    if (visited.has(next.cat)) continue;
    visited.add(next.cat);
    try {
      const members = await fetchCategoryMembers(next.cat);
      let pagesThis = 0;
      let subcatsThis = 0;
      for (const m of members) {
        if (m.ns === 0 && !m.title.startsWith('Java Edition') && !discovered.has(m.title)) {
          discovered.add(m.title);
          pagesThis++;
        } else if (m.ns === 14 && next.depth < maxDepth) {
          queue.push({ cat: m.title, depth: next.depth + 1 });
          subcatsThis++;
        }
      }
      console.log(
        `  cat ${next.cat.padEnd(40)} depth=${String(next.depth)}  +${String(pagesThis)}p ${String(subcatsThis)}subcat  total=${String(discovered.size)}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ! cat ${next.cat}: ${msg}`);
      state.errors.push({ slug: next.cat, message: msg });
    }
    state.visitedCategories = Array.from(visited);
    state.discoveredPages = Array.from(discovered);
    await saveState(state);
    await sleep(INTER_REQUEST_MS);
  }
  return discovered;
}

async function fetchRaw(page: string, attempt = 1, hops = 0): Promise<string> {
  const slug = slugify(page);
  const url = `${WIKI_BASE}/w/${encodeURIComponent(slug)}?action=raw`;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/plain, text/x-wiki, */*' },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (res.status === 200) {
      const ct = res.headers.get('content-type') ?? '';
      if (/^(text\/html|application\/json)/i.test(ct)) {
        throw new Error(`unexpected content-type ${ct}`);
      }
      const body = await res.text();
      if (body.length === 0) throw new Error('empty body');
      const redirect = /^#REDIRECT\s+\[\[([^#\]|]+)/i.exec(body.trimStart());
      if (redirect && hops < 3) {
        const target = redirect[1]?.trim();
        if (target && target.toLowerCase() !== page.toLowerCase()) {
          return await fetchRaw(target, 1, hops + 1);
        }
      }
      return body;
    }
    if (res.status === 404) throw new Error('404');
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const backoff = 1500 * 2 ** (attempt - 1) + Math.random() * 500;
      await sleep(backoff);
      return await fetchRaw(page, attempt + 1, hops);
    }
    throw new Error(`http ${String(res.status)}`);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAllPages(pages: Iterable<string>, state: CrawlState): Promise<void> {
  const fetched = new Set<string>(state.fetchedSlugs);
  let count = 0;
  let success = 0;
  let errors = 0;
  const list = Array.from(pages).sort();
  for (const title of list) {
    count++;
    const slug = slugify(title);
    const outPath = cachePath(slug);
    if (fetched.has(slug) && existsSync(outPath)) {
      continue;
    }
    try {
      const body = await fetchRaw(title);
      if (existsSync(outPath)) {
        const prev = await readFile(outPath, 'utf8');
        if (prev === body) {
          fetched.add(slug);
          state.fetchedSlugs = Array.from(fetched);
          if (count % 25 === 0) {
            console.log(
              `  ${String(count)}/${String(list.length)}  = ${slug.padEnd(40)}  (unchanged)`,
            );
            await saveState(state);
          }
          continue;
        }
      }
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, body, 'utf8');
      fetched.add(slug);
      state.fetchedSlugs = Array.from(fetched);
      success++;
      if (count % 25 === 0) {
        console.log(
          `  ${String(count)}/${String(list.length)}  + ${slug.padEnd(40)}  ${String(body.length)}b`,
        );
        await saveState(state);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      state.errors.push({ slug, message: msg });
      errors++;
      if (errors <= 20) {
        console.warn(`  ! ${slug}: ${msg}`);
      }
    }
    await sleep(INTER_REQUEST_MS);
  }
  console.log(
    `done: processed=${String(count)}, newly-fetched=${String(success)}, errors=${String(errors)}`,
  );
  await saveState(state);
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const skipCategories = args.includes('--no-categories');
  const force = args.includes('--force');

  await mkdir(CACHE_DIR, { recursive: true });
  const state = force
    ? {
        discoveredPages: [],
        visitedCategories: [],
        fetchedSlugs: [],
        lastRunAt: '',
        errors: [],
      }
    : await loadState();

  if (!skipCategories) {
    console.log(
      `walking ${String(ROOT_CATEGORIES.length)} root categories at depth ${String(CATEGORY_DEPTH)}`,
    );
    await walkCategories(ROOT_CATEGORIES, CATEGORY_DEPTH, state);
  }

  // Include any pre-existing cache files we want to keep refreshed.
  const existing = (await readdir(CACHE_DIR).catch(() => [] as string[]))
    .filter((n) => n.endsWith('.wikitext'))
    .map((n) => n.replace(/\.wikitext$/, '').replace(/_/g, ' '));
  const pages = new Set<string>([...state.discoveredPages, ...existing]);

  console.log(`fetching ${String(pages.size)} pages into ${CACHE_DIR}`);
  await fetchAllPages(pages, state);

  console.log(`errors: ${String(state.errors.length)}`);
  return state.errors.length > state.discoveredPages.length / 4 ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (err: unknown) => {
    console.error('fatal:', err);
    process.exit(1);
  },
);
