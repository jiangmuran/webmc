#!/usr/bin/env tsx
// Ingest the Reimagined resource pack (authorized by original creator Reijvi,
// see public/assets/LICENSE.txt) into webmc's own asset namespace.
//
// - Source: 外部授权开源材质包/§aReimagined§0_§8[v1.62.2]§0/
// - Destination: public/assets/<category>/<filename>.png
//
// Only .png files under assets/minecraft/textures/ are copied. All JSON,
// .mcmeta, shader, font, and blockstates files are dropped — those encode
// Mojang's asset schema, not Reijvi's artwork, and we do not ship them.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(process.cwd(), '外部授权开源材质包/§aReimagined§0_§8[v1.62.2]§0');
const SRC_TEXTURES = path.join(ROOT, 'assets', 'minecraft', 'textures');
const DEST = path.resolve(process.cwd(), 'public/assets');
const PROVENANCE = path.resolve(process.cwd(), 'docs/asset-provenance.md');

const CATEGORY_MAP: Record<string, string> = {
  block: 'blocks',
  item: 'items',
  entity: 'entity',
  effect: 'effect',
  environment: 'environment',
  gui: 'gui',
  map: 'map',
  mob_effect: 'effect',
  models: 'models_drop', // dropped below
  painting: 'painting',
  particle: 'particle',
  font: 'font_drop',
};

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

async function main(): Promise<void> {
  try {
    await fs.access(SRC_TEXTURES);
  } catch {
    console.error(`Source not found: ${SRC_TEXTURES}`);
    process.exit(1);
  }

  await fs.mkdir(DEST, { recursive: true });
  await fs.mkdir(path.dirname(PROVENANCE), { recursive: true });

  const files = await walk(SRC_TEXTURES);
  const provenance: { src: string; dst: string }[] = [];
  let copied = 0;
  let skippedNonPng = 0;
  let skippedDroppedCategory = 0;

  for (const src of files) {
    const rel = path.relative(SRC_TEXTURES, src);
    if (!src.endsWith('.png')) {
      skippedNonPng++;
      continue;
    }
    const parts = rel.split(path.sep);
    const topCategory = parts[0] ?? '';
    const mapped = CATEGORY_MAP[topCategory] ?? topCategory;
    if (mapped.endsWith('_drop')) {
      skippedDroppedCategory++;
      continue;
    }
    const subPath = parts.slice(1).join(path.sep);
    const dst = path.join(DEST, mapped, subPath);
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.copyFile(src, dst);
    provenance.push({ src: rel, dst: path.relative(process.cwd(), dst) });
    copied++;
  }

  provenance.sort((a, b) => a.dst.localeCompare(b.dst));
  const manifest = [
    '# Asset provenance — Reimagined pack',
    '',
    'All files below were extracted from the Reimagined texture pack under the',
    'written authorization of the original creator (see public/assets/LICENSE.txt).',
    'The `assets/minecraft/` schema directories, JSON model/blockstate files,',
    '`.mcmeta`, `.lang`, shader sources, and font data were NOT ingested.',
    '',
    `Ingested files: ${copied.toString()}`,
    `Skipped non-PNG: ${skippedNonPng.toString()}`,
    `Skipped dropped category: ${skippedDroppedCategory.toString()}`,
    '',
    '| Destination | Source (under assets/minecraft/textures/) |',
    '|-------------|-------------------------------------------|',
    ...provenance.map((p) => `| \`${p.dst}\` | \`${p.src}\` |`),
  ].join('\n');

  await fs.writeFile(PROVENANCE, `${manifest}\n`, 'utf8');

  console.log(`Copied ${copied.toString()} PNG files`);
  console.log(
    `Skipped ${skippedNonPng.toString()} non-PNG + ${skippedDroppedCategory.toString()} in dropped categories`,
  );
  console.log(`Manifest: ${path.relative(process.cwd(), PROVENANCE)}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
