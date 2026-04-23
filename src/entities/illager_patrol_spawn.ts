export interface PatrolCtx {
  dayCount: number;
  playerTicksSinceLastPatrol: number;
  nearbyPatrolCount: number;
}

export const MIN_DAY_FOR_PATROL = 5;
export const MIN_TICKS_BETWEEN = 12000;
export const MAX_CONCURRENT_PATROLS = 1;

export function shouldSpawnPatrol(c: PatrolCtx, rng: () => number): boolean {
  if (c.dayCount < MIN_DAY_FOR_PATROL) return false;
  if (c.nearbyPatrolCount >= MAX_CONCURRENT_PATROLS) return false;
  if (c.playerTicksSinceLastPatrol < MIN_TICKS_BETWEEN) return false;
  return rng() < 0.2;
}

export function patrolSize(): number {
  return 5;
}
