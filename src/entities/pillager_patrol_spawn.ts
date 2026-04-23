// Pillager patrol. Small groups spawn every ~2-5 min far from spawn
// after first day passes. Captain of patrol gives Raid Captain banner.

export interface PatrolCtx {
  daysSinceWorldStart: number;
  distanceFromSpawn: number;
  ticksSinceLastPatrol: number;
  rand: () => number;
}

export const MIN_PATROL_COOLDOWN_TICKS = 2400;
export const MAX_PATROL_COOLDOWN_TICKS = 6000;
export const MIN_DISTANCE_FROM_SPAWN = 64;

export function shouldSpawnPatrol(c: PatrolCtx): boolean {
  if (c.daysSinceWorldStart < 1) return false;
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
