// Spawn attempt cycle. Picks a candidate spawn position in a loaded
// chunk; tests light/category/cap rules.

export interface SpawnAttempt {
  x: number;
  y: number;
  z: number;
  category: 'monster' | 'creature' | 'ambient';
  skyLight: number;
  blockLight: number;
  onValidSurface: boolean;
}

export const HOSTILE_MAX_LIGHT = 0;
export const PASSIVE_MIN_LIGHT = 9;

export function canSpawnMonsterHere(a: SpawnAttempt): boolean {
  if (!a.onValidSurface) return false;
  if (a.category !== 'monster') return false;
  return Math.max(a.skyLight, a.blockLight) <= HOSTILE_MAX_LIGHT;
}

export function canSpawnPassiveHere(a: SpawnAttempt): boolean {
  if (!a.onValidSurface) return false;
  if (a.category !== 'creature') return false;
  return a.skyLight >= PASSIVE_MIN_LIGHT;
}

export const SPAWN_PER_CHUNK_ATTEMPTS = 3;
