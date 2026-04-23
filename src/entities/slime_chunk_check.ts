// Slime chunks. A ~10% of chunks at y < 40 permit slime spawning
// regardless of light; the chunk ID is derived from seed + coords.

const HASH_MOD = 10;

export function isSlimeChunk(seed: number, chunkX: number, chunkZ: number): boolean {
  let h = seed >>> 0;
  h = (Math.imul(h ^ chunkX, 2654435761) ^ chunkZ) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 1597334677) >>> 0;
  return h % HASH_MOD === 0;
}

export function canSpawnSlimeHere(
  seed: number,
  chunkX: number,
  chunkZ: number,
  y: number,
  biome: string,
  isNight: boolean,
  moonFullness: number,
): boolean {
  if (biome === 'swamp' && y >= 50 && y <= 70 && isNight) {
    return moonFullness >= 0.5;
  }
  if (y < 40 && isSlimeChunk(seed, chunkX, chunkZ)) return true;
  return false;
}

export const SLIME_UNDERGROUND_MAX_Y = 40;
