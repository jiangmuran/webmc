// Wandering trader spawn. One active per overworld at a time; spawn
// chance rises over time since last spawn. Trader stays ~40-60 min
// then despawns.

export interface WorldTraderState {
  lastSpawnTick: number | null;
  activeTraderId: string | null;
  spawnChance: number; // 0..1
}

export const FIRST_SPAWN_CHANCE = 0.025;
export const MAX_SPAWN_CHANCE = 0.075;
export const SPAWN_CHECK_INTERVAL_TICKS = 24000; // 1 day
export const CHANCE_BUMP_PER_FAIL = 0.025;
export const TRADER_LIFE_TICKS = 48000; // ~40 min

export function initState(): WorldTraderState {
  return { lastSpawnTick: null, activeTraderId: null, spawnChance: FIRST_SPAWN_CHANCE };
}

export interface CheckQuery {
  nowTick: number;
  rand: () => number;
}

export function attemptSpawn(
  s: WorldTraderState,
  q: CheckQuery,
): 'spawned' | 'failed' | 'already_active' {
  if (s.activeTraderId !== null) return 'already_active';
  const roll = q.rand();
  if (roll < s.spawnChance) {
    s.activeTraderId = `wt_${q.nowTick}`;
    s.lastSpawnTick = q.nowTick;
    s.spawnChance = FIRST_SPAWN_CHANCE;
    return 'spawned';
  }
  s.spawnChance = Math.min(MAX_SPAWN_CHANCE, s.spawnChance + CHANCE_BUMP_PER_FAIL);
  return 'failed';
}

export function despawnIfExpired(s: WorldTraderState, nowTick: number): boolean {
  if (s.activeTraderId === null || s.lastSpawnTick === null) return false;
  if (nowTick - s.lastSpawnTick >= TRADER_LIFE_TICKS) {
    s.activeTraderId = null;
    return true;
  }
  return false;
}
