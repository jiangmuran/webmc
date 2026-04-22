// Spawn protection. Non-op players cannot break or place blocks within
// a configurable radius around world spawn. Hostile mobs don't spawn in
// the inner "spawn chunks" radius either. Server-only; single-player
// worlds have 0 radius.

export interface SpawnProtectionConfig {
  radius: number; // blocks; 0 = disabled
  opLevel: number; // ops at >= this level bypass protection
}

export function defaultConfig(): SpawnProtectionConfig {
  return { radius: 16, opLevel: 2 };
}

export interface ProtectionQuery {
  worldSpawn: { x: number; z: number };
  action: { x: number; z: number };
  playerOpLevel: number; // 0..4
  config: SpawnProtectionConfig;
}

export function isProtected(q: ProtectionQuery): boolean {
  if (q.config.radius <= 0) return false;
  if (q.playerOpLevel >= q.config.opLevel) return false;
  const dx = q.action.x - q.worldSpawn.x;
  const dz = q.action.z - q.worldSpawn.z;
  return Math.max(Math.abs(dx), Math.abs(dz)) <= q.config.radius;
}

// "Spawn chunks" — a persistent 16×16 chunk square around world spawn
// that's always loaded. Used by farms/redstone clocks at spawn.
export const SPAWN_CHUNK_RADIUS = 8; // 16×16 total

export function isSpawnChunk(
  chunkCx: number,
  chunkCz: number,
  spawnCx: number,
  spawnCz: number,
): boolean {
  const dx = Math.abs(chunkCx - spawnCx);
  const dz = Math.abs(chunkCz - spawnCz);
  return Math.max(dx, dz) <= SPAWN_CHUNK_RADIUS;
}

// Hostile mobs don't spawn within MOBSPAWN_SAFE_RADIUS of world spawn.
export const MOBSPAWN_SAFE_RADIUS = 24;

export function canHostileSpawnAt(
  pos: { x: number; z: number },
  worldSpawn: { x: number; z: number },
): boolean {
  const dx = pos.x - worldSpawn.x;
  const dz = pos.z - worldSpawn.z;
  return Math.hypot(dx, dz) > MOBSPAWN_SAFE_RADIUS;
}
