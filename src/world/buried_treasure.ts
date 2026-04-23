// Buried treasure. One chest per beach chunk bucket, seeded
// per-chunk. Map from shipwreck/ruined-portal points to it.

export interface TreasureChest {
  x: number;
  y: number;
  z: number;
  hasHeartOfTheSea: boolean;
}

export function chunkHasTreasure(chunkX: number, chunkZ: number, seed: number): boolean {
  const h = hash(seed, chunkX, chunkZ);
  return h % 100 < 1; // ~1% of chunks
}

export function treasureForChunk(chunkX: number, chunkZ: number, seed: number): TreasureChest {
  const h1 = hash(seed, chunkX, chunkZ);
  const h2 = hash(seed + 1, chunkX, chunkZ);
  return {
    x: chunkX * 16 + (h1 & 15),
    y: 45 + ((h2 >>> 4) % 10),
    z: chunkZ * 16 + ((h1 >> 8) & 15),
    hasHeartOfTheSea: true,
  };
}

function hash(seed: number, a: number, b: number): number {
  let h = seed >>> 0;
  h = (Math.imul(h ^ a, 2654435761) ^ b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1597334677) >>> 0;
  return h >>> 0;
}

export const TREASURE_Y_MIN = 40;
export const TREASURE_Y_MAX = 60;
