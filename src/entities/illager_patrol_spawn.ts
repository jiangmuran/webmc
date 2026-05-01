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

// Wiki (minecraft.wiki/w/Patrol#Spawning): "Patrols spawn as a
// group of 1-5 pillagers in Java Edition." Sibling
// pillager_patrol_spawn_rate.ts already returns 1 + floor(rng()*5).
// Old `return 5` always produced max-size patrols, ignoring wiki's
// uniform 1-5 range — and so removing the variability of natural
// patrol encounters.
export function patrolSize(rng: () => number = () => 0.99): number {
  return 1 + Math.floor(rng() * 5);
}
