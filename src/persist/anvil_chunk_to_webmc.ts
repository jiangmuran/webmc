import { extractChunkFromRegion } from './anvil_chunk_extract';
import { parseChunkSections, blockIndex } from './anvil_section_parse';
import { resolveVanillaName } from './vanilla_block_map';

// End-to-end pipeline: vanilla region bytes (.mca) + (cx, cz) → flat
// webmc block-id array for that 16×16×Y_RANGE chunk column.
//
// The output is a Uint16Array indexed by Y*256+Z*16+X, where Y is in
// 0..(sectionCount*16-1). Sections beyond the chunk's last "sections"
// entry are filled with `airId`.

export interface ChunkImportResult {
  ids: Uint16Array;
  yMin: number;
  yMax: number;
  paletteSize: number;
}

export interface BlockResolver {
  byName: (name: string) => number | undefined;
  airId: number;
  fallbackId: number;
}

export async function importVanillaChunk(
  regionBytes: Uint8Array,
  cx: number,
  cz: number,
  res: BlockResolver,
): Promise<ChunkImportResult | null> {
  const root = await extractChunkFromRegion(regionBytes, cx, cz);
  if (!root) return null;
  const sections = parseChunkSections(root.value);
  if (sections.length === 0) return null;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const s of sections) {
    if (s.y < yMin) yMin = s.y;
    if (s.y > yMax) yMax = s.y;
  }
  const sectionCount = yMax - yMin + 1;
  const ids = new Uint16Array(16 * 16 * 16 * sectionCount);
  ids.fill(res.airId);
  let totalPaletteSize = 0;
  for (const s of sections) {
    totalPaletteSize += s.palette.length;
    // Translate palette entries to webmc ids once.
    const translated = new Uint16Array(s.palette.length);
    for (let i = 0; i < s.palette.length; i++) {
      const entry = s.palette[i];
      const name = entry?.name ?? 'minecraft:air';
      translated[i] = resolveVanillaName(name, res.byName, res.fallbackId);
    }
    const yOffset = (s.y - yMin) * 16;
    for (let ly = 0; ly < 16; ly++) {
      for (let lz = 0; lz < 16; lz++) {
        for (let lx = 0; lx < 16; lx++) {
          const srcIdx = blockIndex(lx, ly, lz);
          const palIdx = s.indices[srcIdx] ?? 0;
          const id = translated[palIdx] ?? res.airId;
          const dstIdx = blockIndex(lx, yOffset + ly, lz);
          ids[dstIdx] = id;
        }
      }
    }
  }
  return { ids, yMin: yMin * 16, yMax: yMax * 16 + 15, paletteSize: totalPaletteSize };
}
