import type { NbtValue } from './nbt_compound';
import { decodeNbt, type NbtRoot } from './nbt_decode';

// Structure block .nbt file parser. The format is a single uncompressed
// (caller may have already gunzipped) NBT compound:
//   { size: LIST<INT>[3], palette: LIST<COMPOUND>, blocks: LIST<COMPOUND>, entities: LIST<COMPOUND>, DataVersion: INT }
// Each block: { state: INT (palette index), pos: LIST<INT>[3], [nbt: COMPOUND] }
//
// Source: minecraft.wiki "Structure block file format". Behavioral spec — clean-room.

export interface StructurePaletteEntry {
  name: string;
}

export interface StructureBlock {
  paletteIndex: number;
  x: number;
  y: number;
  z: number;
}

export interface ParsedStructure {
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  palette: StructurePaletteEntry[];
  blocks: StructureBlock[];
  dataVersion: number;
}

function listInts(v: NbtValue | undefined, expectedLen: number): number[] {
  if (v?.type !== 'list') return new Array<number>(expectedLen).fill(0);
  const out: number[] = [];
  for (const item of v.value) {
    if (item.type === 'int' || item.type === 'short' || item.type === 'byte') out.push(item.value);
  }
  while (out.length < expectedLen) out.push(0);
  return out;
}

function readPalette(v: NbtValue | undefined): StructurePaletteEntry[] {
  if (v?.type !== 'list') return [];
  const out: StructurePaletteEntry[] = [];
  for (const e of v.value) {
    if (e.type !== 'compound') continue;
    const nameV = e.value['Name'];
    out.push({ name: nameV?.type === 'string' ? nameV.value : 'minecraft:air' });
  }
  return out;
}

function readBlocks(v: NbtValue | undefined): StructureBlock[] {
  if (v?.type !== 'list') return [];
  const out: StructureBlock[] = [];
  for (const e of v.value) {
    if (e.type !== 'compound') continue;
    const state = e.value['state'];
    const pos = e.value['pos'];
    const stateIdx =
      state?.type === 'int' || state?.type === 'short' || state?.type === 'byte' ? state.value : 0;
    const xyz = listInts(pos, 3);
    out.push({ paletteIndex: stateIdx, x: xyz[0] ?? 0, y: xyz[1] ?? 0, z: xyz[2] ?? 0 });
  }
  return out;
}

export function parseStructureFromNbt(root: NbtRoot): ParsedStructure {
  if (root.value.type !== 'compound') {
    return { sizeX: 0, sizeY: 0, sizeZ: 0, palette: [], blocks: [], dataVersion: 0 };
  }
  const c = root.value.value;
  const size = listInts(c['size'], 3);
  const dvV = c['DataVersion'];
  return {
    sizeX: size[0] ?? 0,
    sizeY: size[1] ?? 0,
    sizeZ: size[2] ?? 0,
    palette: readPalette(c['palette']),
    blocks: readBlocks(c['blocks']),
    dataVersion:
      dvV?.type === 'int' || dvV?.type === 'short' || dvV?.type === 'byte' ? dvV.value : 0,
  };
}

// Decode an uncompressed structure .nbt byte buffer.
export function parseStructureBytes(bytes: Uint8Array): ParsedStructure {
  return parseStructureFromNbt(decodeNbt(bytes));
}
