import type { NbtValue } from './nbt_compound';

// Anvil section parsing — modern (1.18+) chunk format. Each section has:
//   "block_states": COMPOUND
//     "palette": LIST<COMPOUND>  — each entry has "Name" (string) [+ "Properties"]
//     "data":    LONG_ARRAY      — packed indices into the palette
//
// When the palette has only one entry, "data" is omitted (entire section
// is that block). Index width = max(4, ceil(log2(palette.length))).
// Indices are NOT cross-long; each long packs floor(64 / bits) indices.
//
// Source: minecraft.wiki "Chunk format". Behavioral spec — clean-room safe.

export interface PaletteEntry {
  name: string;
}

export interface AnvilSection {
  y: number;
  palette: PaletteEntry[];
  // 16×16×16 = 4096 indices (always full-length even when source omits "data").
  indices: Uint16Array;
}

const SECTION_BLOCKS = 16 * 16 * 16;

function readPalette(p: NbtValue): PaletteEntry[] {
  if (p.type !== 'list') return [];
  const out: PaletteEntry[] = [];
  for (const entry of p.value) {
    if (entry.type !== 'compound') {
      out.push({ name: 'minecraft:air' });
      continue;
    }
    const nameV = entry.value['Name'];
    out.push({ name: nameV?.type === 'string' ? nameV.value : 'minecraft:air' });
  }
  return out;
}

function unpackIndices(data: BigInt64Array, paletteLen: number): Uint16Array {
  const bits = Math.max(4, Math.ceil(Math.log2(Math.max(2, paletteLen))));
  const perLong = Math.floor(64 / bits);
  const mask = (1n << BigInt(bits)) - 1n;
  const out = new Uint16Array(SECTION_BLOCKS);
  let idx = 0;
  for (let i = 0; i < data.length && idx < SECTION_BLOCKS; i++) {
    let word = data[i] ?? 0n;
    for (let j = 0; j < perLong && idx < SECTION_BLOCKS; j++) {
      out[idx++] = Number(word & mask);
      word >>= BigInt(bits);
    }
  }
  return out;
}

export function parseSection(section: NbtValue, y: number): AnvilSection | null {
  if (section.type !== 'compound') return null;
  const bs = section.value['block_states'];
  if (bs?.type !== 'compound') return null;
  const palette = readPalette(bs.value['palette'] ?? { type: 'list', value: [] });
  if (palette.length === 0) return null;
  const dataV = bs.value['data'];
  if (palette.length === 1 || !dataV || dataV.type !== 'longArray') {
    return { y, palette, indices: new Uint16Array(SECTION_BLOCKS) };
  }
  return { y, palette, indices: unpackIndices(dataV.value, palette.length) };
}

export function parseChunkSections(chunkRoot: NbtValue): AnvilSection[] {
  if (chunkRoot.type !== 'compound') return [];
  const sectionsV = chunkRoot.value['sections'];
  if (sectionsV?.type !== 'list') return [];
  const out: AnvilSection[] = [];
  for (const s of sectionsV.value) {
    if (s.type !== 'compound') continue;
    const yV = s.value['Y'];
    const y = yV?.type === 'byte' || yV?.type === 'short' || yV?.type === 'int' ? yV.value : 0;
    const sec = parseSection(s, y);
    if (sec) out.push(sec);
  }
  return out;
}

export function blockIndex(localX: number, localY: number, localZ: number): number {
  // Section storage order: Y * 256 + Z * 16 + X
  return (localY << 8) | (localZ << 4) | localX;
}
