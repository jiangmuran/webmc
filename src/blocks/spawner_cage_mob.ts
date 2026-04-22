// Mob spawner (monster spawner). Spawns mobs every 200-800 random
// ticks. Limit 6 same-type mobs in a small radius. Player must be
// within 16 blocks. Max 4 spawn attempts per cycle.

export interface MobSpawner {
  mobType: string;
  spawnDelay: number;
  maxNearby: number;
  spawnRange: number;
  requiredPlayerRange: number;
}

export const DEFAULT_SPAWN_DELAY = 200;
export const MAX_NEARBY = 6;
export const PLAYER_RANGE = 16;

export function makeSpawner(mobType: string): MobSpawner {
  return {
    mobType,
    spawnDelay: DEFAULT_SPAWN_DELAY,
    maxNearby: MAX_NEARBY,
    spawnRange: 4,
    requiredPlayerRange: PLAYER_RANGE,
  };
}

export interface SpawnCycleQuery {
  playerInRange: boolean;
  nearbyMobsOfType: number;
  nowTick: number;
  lastSpawnTick: number;
  rand: () => number;
}

export interface SpawnCycleResult {
  mobsToSpawn: number;
  newLastSpawn: number;
}

export function tickSpawner(s: MobSpawner, q: SpawnCycleQuery): SpawnCycleResult {
  if (!q.playerInRange) return { mobsToSpawn: 0, newLastSpawn: q.lastSpawnTick };
  if (q.nearbyMobsOfType >= s.maxNearby) {
    return { mobsToSpawn: 0, newLastSpawn: q.lastSpawnTick };
  }
  if (q.nowTick - q.lastSpawnTick < s.spawnDelay) {
    return { mobsToSpawn: 0, newLastSpawn: q.lastSpawnTick };
  }
  // Up to 4 spawn attempts; each succeeds with 50%.
  let spawned = 0;
  for (let i = 0; i < 4; i++) if (q.rand() < 0.5) spawned += 1;
  return { mobsToSpawn: spawned, newLastSpawn: q.nowTick };
}

// Spawner gives XP when broken (15-43 XP based on type).
export const SPAWNER_XP_RANGE = { min: 15, max: 43 };

export function brokenXp(rand: () => number): number {
  return (
    SPAWNER_XP_RANGE.min + Math.floor(rand() * (SPAWNER_XP_RANGE.max - SPAWNER_XP_RANGE.min + 1))
  );
}
