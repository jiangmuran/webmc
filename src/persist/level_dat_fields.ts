// level.dat known fields used during import → webmc save. We only
// accept the behavioral fields; never Mojang copyrighted brand strings.

import type { NbtValue } from './nbt_compound';
import { decodeNbt } from './nbt_decode';

export interface LevelDatFields {
  seed: string;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
  gameTime: number; // ticks
  dayTime: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  hardcore: boolean;
  generatorName: string;
}

export function sanitizeForImport(raw: Partial<LevelDatFields>): LevelDatFields {
  return {
    seed: raw.seed ?? '0',
    spawnX: Math.floor(raw.spawnX ?? 0),
    spawnY: Math.floor(raw.spawnY ?? 64),
    spawnZ: Math.floor(raw.spawnZ ?? 0),
    gameTime: Math.max(0, raw.gameTime ?? 0),
    dayTime: (((raw.dayTime ?? 0) % 24000) + 24000) % 24000,
    difficulty: raw.difficulty ?? 'normal',
    hardcore: raw.hardcore ?? false,
    generatorName: 'webmc_default', // rebranded — we never ship MC generator name
  };
}

export function extractSeedDigest(seed: string): string {
  // Trivial pseudo-hash: keep numeric string or hash characters.
  if (/^-?\d+$/.test(seed)) return seed;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return String(h);
}

function num(v: NbtValue | undefined): number | undefined {
  if (!v) return undefined;
  if (
    v.type === 'byte' ||
    v.type === 'short' ||
    v.type === 'int' ||
    v.type === 'float' ||
    v.type === 'double'
  )
    return v.value;
  if (v.type === 'long') return Number(v.value);
  return undefined;
}

function findCompound(v: NbtValue, key: string): Record<string, NbtValue> | undefined {
  if (v.type !== 'compound') return undefined;
  const c = v.value[key];
  if (c?.type === 'compound') return c.value;
  return undefined;
}

const DIFFICULTIES: ReadonlyArray<'peaceful' | 'easy' | 'normal' | 'hard'> = [
  'peaceful',
  'easy',
  'normal',
  'hard',
];

// Parse uncompressed level.dat NBT bytes into a sanitized field set.
// Caller is responsible for gunzipping if the file is gzipped.
export function parseLevelDat(bytes: Uint8Array): LevelDatFields {
  const root = decodeNbt(bytes);
  // Real level.dat has a top-level "Data" compound.
  const data =
    findCompound(root.value, 'Data') ?? (root.value.type === 'compound' ? root.value.value : {});
  const seedV = data['RandomSeed'] ?? data['Seed'] ?? data['seed'];
  const seed =
    seedV?.type === 'long'
      ? String(seedV.value)
      : seedV?.type === 'string'
        ? seedV.value
        : seedV !== undefined
          ? String(num(seedV) ?? 0)
          : '0';
  const diffNum = num(data['Difficulty']);
  const difficulty =
    diffNum !== undefined && diffNum >= 0 && diffNum < DIFFICULTIES.length
      ? DIFFICULTIES[diffNum]
      : undefined;
  const partial: Partial<LevelDatFields> = { seed, hardcore: num(data['hardcore']) === 1 };
  const sx = num(data['SpawnX']);
  if (sx !== undefined) partial.spawnX = sx;
  const sy = num(data['SpawnY']);
  if (sy !== undefined) partial.spawnY = sy;
  const sz = num(data['SpawnZ']);
  if (sz !== undefined) partial.spawnZ = sz;
  const gt = num(data['Time']);
  if (gt !== undefined) partial.gameTime = gt;
  const dt = num(data['DayTime']);
  if (dt !== undefined) partial.dayTime = dt;
  if (difficulty !== undefined) partial.difficulty = difficulty;
  return sanitizeForImport(partial);
}
