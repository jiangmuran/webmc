// Pillager patrol. Wiki (minecraft.wiki/w/Pillager#Patrols): "Patrols
// occur after 5½ in-game days, any time and independently of
// structures." Old `daysSinceWorldStart < 1` allowed patrols starting
// on day 1 — 4.5 days earlier than the wiki canon. Captain of a
// patrol drops the ominous banner on death (handled elsewhere).

export interface PatrolCtx {
  daysSinceWorldStart: number;
  distanceFromSpawn: number;
  ticksSinceLastPatrol: number;
  rand: () => number;
}

export const MIN_PATROL_COOLDOWN_TICKS = 2400;
export const MAX_PATROL_COOLDOWN_TICKS = 6000;
export const MIN_DISTANCE_FROM_SPAWN = 64;
export const MIN_DAYS_SINCE_START = 5.5;

export function shouldSpawnPatrol(c: PatrolCtx): boolean {
  if (c.daysSinceWorldStart < MIN_DAYS_SINCE_START) return false;
  if (c.distanceFromSpawn < MIN_DISTANCE_FROM_SPAWN) return false;
  if (c.ticksSinceLastPatrol < MIN_PATROL_COOLDOWN_TICKS) return false;
  return c.rand() < 0.2;
}

export function patrolSize(difficulty: 'easy' | 'normal' | 'hard'): number {
  return difficulty === 'hard' ? 5 : difficulty === 'normal' ? 4 : 3;
}

export function captainHasBanner(): boolean {
  return true;
}
