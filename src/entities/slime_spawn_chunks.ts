// Slime spawn rules. Slimes spawn in special "slime chunks" at y<40
// on any light level, and also in swamp biomes between y=50-70 on
// light ≤ 7.

export interface SlimeChunkQuery {
  worldSeed: bigint;
  cx: number;
  cz: number;
}

// Java slime-chunk predicate (deterministic). A chunk is a slime
// chunk if rand(seed ^ cx^2*0x4c1906 + cx*0x5ac0db + cz^2*0x4307a7 + cz*0x5f24f ^ 0x3ad8025f) % 10 == 0.
export function isSlimeChunk(q: SlimeChunkQuery): boolean {
  const cx = BigInt(q.cx);
  const cz = BigInt(q.cz);
  const mixed =
    q.worldSeed + cx * cx * 0x4c1906n + cx * 0x5ac0dbn + cz * cz * 0x4307a7n + cz * 0x5f24fn;
  // Fast mix → mod 10
  const n = mixed ^ 0x3ad8025fn;
  return ((n % 10n) + 10n) % 10n === 0n;
}

export interface SwampQuery {
  biome: string;
  y: number;
  lightLevel: number;
}

export function canSpawnInSwamp(q: SwampQuery): boolean {
  if (q.biome !== 'swamp' && q.biome !== 'mangrove_swamp') return false;
  if (q.y < 50 || q.y > 70) return false;
  return q.lightLevel <= 7;
}

// Slime chunk always allows spawning below y=40 regardless of light.
export const SLIME_CHUNK_MAX_Y = 40;

export function canSpawnInSlimeChunk(y: number): boolean {
  return y < SLIME_CHUNK_MAX_Y;
}
