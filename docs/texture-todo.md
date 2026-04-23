# Texture TODO

We need **original** 16×16 pixel art per block. Rules:

1. License: CC0 or AGPL-3.0-or-later. Put a `LICENSE.txt` alongside the art files naming the artist and the license.
2. Do NOT reuse Mojang's `assets/minecraft/` directory layout, model JSON files, or any existing MC pack's UV templates. Draw from scratch.
3. Target path in-repo: `public/assets/blocks/<block_id>.png` (and `_top.png` / `_side.png` / `_bottom.png` for blocks with distinct faces). Single namespace — no `assets/minecraft/` dirs.
4. Palette: match the project's procedural atlas family so one block looks consistent at night / in fog. The current generator is at `scripts/assets/` — run `npm run build:atlas` to see what families exist.
5. Submit a PR that touches `public/assets/blocks/` only. Do not add model JSON, `pack.mcmeta`, or overlay folders — webmc's renderer reads block faces from the registry, not from MC-format packs.

## How to get the block list

The full list of block IDs that need textures lives at `src/blocks/registry.ts`. To dump it to a CSV for the artist:

```bash
npx tsx scripts/dump-block-ids.ts > /tmp/webmc-blocks.csv
```

That script walks the registry and emits `id,family,facesNeeded` — safe to share with an artist.

## What NOT to accept

- Third-party Patreon packs (e.g., "Reimagined by Reijvi") — they carry someone else's copyright regardless of what the downloader calls them, and their directory structure is Mojang's.
- Anything with `assets/minecraft/` at the top of the zip.
- Anything without a clear `LICENSE` file naming the artist.

If a pack arrives that doesn't meet these criteria, decline it and ask the artist to re-submit as a flat `<id>.png` set under a free license.
