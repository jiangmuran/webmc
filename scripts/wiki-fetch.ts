#!/usr/bin/env -S node --experimental-strip-types
/**
 * wiki-fetch: download raw wikitext from minecraft.wiki into /docs/wiki-cache/.
 *
 * Behavioral-reference tool for the clean-room reimplementation.
 * Reads raw wikitext (via ?action=raw) so precise numeric values — tick delays,
 * signal strengths, drop rates — are preserved verbatim, unlike WebFetch's
 * summarization.
 *
 * Usage:
 *   tsx scripts/wiki-fetch.ts --seed
 *     Fetch the 20 foundation pages required by M0.
 *
 *   tsx scripts/wiki-fetch.ts <page> [<page> ...]
 *     Fetch specific pages by their wiki slug (spaces become underscores).
 *
 *   tsx scripts/wiki-fetch.ts --refresh
 *     Re-fetch every page currently in the cache (updates stale entries).
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');
const CACHE_DIR = join(REPO_ROOT, 'docs', 'wiki-cache');
const WIKI_BASE = 'https://minecraft.wiki';
const USER_AGENT =
  'webmc-wiki-fetch/0.0 (clean-room reimplementation; https://github.com/ajmr/webmc; behavioral-reference only)';

const SEED_PAGES = [
  'Grass Block',
  'Stone',
  'Dirt',
  'Cobblestone',
  'Oak Log',
  'Redstone Dust',
  'Piston',
  'Torch',
  'Crafting',
  'Smelting',
  'Tick',
  'Light',
  'Biome',
  'Chunk format',
  'Redstone circuits',
  'Water',
  'Lava',
  'Zombie',
  'Block states',
  'Block entity',
] as const;

interface FetchResult {
  slug: string;
  page: string;
  bytes: number;
  cached: string;
  status: 'fetched' | 'unchanged' | 'error';
  error?: string;
}

function slugify(page: string): string {
  return page.trim().replace(/\s+/g, '_');
}

function cachePath(slug: string): string {
  return join(CACHE_DIR, `${slug}.wikitext`);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchRaw(page: string, attempt = 1): Promise<string> {
  const slug = slugify(page);
  const url = `${WIKI_BASE}/w/${encodeURIComponent(slug)}?action=raw`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/plain, text/x-wiki, */*',
    },
    redirect: 'follow',
  });
  if (res.status === 200) {
    const body = await res.text();
    if (body.length === 0) throw new Error(`empty body for ${slug}`);
    return body;
  }
  if (res.status === 404) {
    throw new Error(`page not found: ${slug}`);
  }
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const backoff = 1000 * 2 ** (attempt - 1) + Math.random() * 250;
    await sleep(backoff);
    return fetchRaw(page, attempt + 1);
  }
  throw new Error(`http ${String(res.status)} fetching ${slug}`);
}

async function fetchOne(page: string): Promise<FetchResult> {
  const slug = slugify(page);
  const outPath = cachePath(slug);
  try {
    const body = await fetchRaw(page);
    if (existsSync(outPath)) {
      const prev = await readFile(outPath, 'utf8');
      if (prev === body) {
        return { slug, page, bytes: body.length, cached: outPath, status: 'unchanged' };
      }
    }
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, body, 'utf8');
    return { slug, page, bytes: body.length, cached: outPath, status: 'fetched' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { slug, page, bytes: 0, cached: outPath, status: 'error', error: msg };
  }
}

async function fetchMany(pages: readonly string[]): Promise<FetchResult[]> {
  const results: FetchResult[] = [];
  for (const page of pages) {
    const r = await fetchOne(page);
    const tag = r.status === 'fetched' ? '+' : r.status === 'unchanged' ? '=' : '!';
    const size = r.status === 'error' ? (r.error ?? 'error') : `${String(r.bytes)}b`;
    console.log(`  ${tag} ${r.slug.padEnd(26)} ${size}`);
    results.push(r);
    await sleep(400);
  }
  return results;
}

async function listCached(): Promise<string[]> {
  if (!existsSync(CACHE_DIR)) return [];
  const entries = await readdir(CACHE_DIR);
  return entries
    .filter((e) => e.endsWith('.wikitext'))
    .map((e) => e.replace(/\.wikitext$/, '').replace(/_/g, ' '));
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  let pages: readonly string[];

  if (args.length === 0) {
    console.error('usage: tsx scripts/wiki-fetch.ts --seed | --refresh | <page> [<page> ...]');
    return 2;
  }

  if (args[0] === '--seed') {
    pages = SEED_PAGES;
    console.log(`seeding ${String(pages.length)} foundation pages into ${CACHE_DIR}`);
  } else if (args[0] === '--refresh') {
    pages = await listCached();
    if (pages.length === 0) {
      console.error('cache empty — nothing to refresh. run --seed first.');
      return 1;
    }
    console.log(`refreshing ${String(pages.length)} cached pages`);
  } else {
    pages = args;
    console.log(`fetching ${String(pages.length)} page(s)`);
  }

  await mkdir(CACHE_DIR, { recursive: true });
  const results = await fetchMany(pages);
  const fetched = results.filter((r) => r.status === 'fetched').length;
  const unchanged = results.filter((r) => r.status === 'unchanged').length;
  const errors = results.filter((r) => r.status === 'error');
  console.log(
    `done: ${String(fetched)} fetched, ${String(unchanged)} unchanged, ${String(errors.length)} error(s)`,
  );
  if (errors.length > 0) {
    for (const e of errors) console.error(`  ! ${e.slug}: ${e.error ?? 'unknown'}`);
    return 1;
  }
  return 0;
}

main().then(
  (code) => process.exit(code),
  (err: unknown) => {
    console.error('fatal:', err);
    process.exit(1);
  },
);
