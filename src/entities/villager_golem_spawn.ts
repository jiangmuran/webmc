// Iron golem spawn check. Triggered when enough villagers gather at a
// POI after a panic or schedule event. Needs at least 2 villagers
// "gossiping" + clear space for golem spawn.

export interface GolemSpawnQuery {
  villagersInPanicArea: number;
  openSpaceCount: number; // candidate 2x2x3 spawn slots
  recentGolemSpawnsInVillage: number;
  maxGolemsInVillage: number;
}

export const PANIC_VILLAGERS_THRESHOLD = 2;

export interface SpawnResult {
  spawn: boolean;
  reason: 'ok' | 'not_enough_villagers' | 'no_space' | 'golem_cap';
}

export function tryGolemSpawn(q: GolemSpawnQuery): SpawnResult {
  if (q.villagersInPanicArea < PANIC_VILLAGERS_THRESHOLD) {
    return { spawn: false, reason: 'not_enough_villagers' };
  }
  if (q.openSpaceCount <= 0) return { spawn: false, reason: 'no_space' };
  if (q.recentGolemSpawnsInVillage >= q.maxGolemsInVillage) {
    return { spawn: false, reason: 'golem_cap' };
  }
  return { spawn: true, reason: 'ok' };
}

// Cap scales with village pop: 1 golem per 10 villagers.
export function maxGolemsForPopulation(pop: number): number {
  return Math.max(1, Math.floor(pop / 10));
}
