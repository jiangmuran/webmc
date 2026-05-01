// Pillager patrol. Wiki (minecraft.wiki/w/Patrol#Conditions): "Patrols
// spawn naturally after the world age reaches 100 minutes (5 in-game
// days), then after a delay of 10–11 minutes ... an attempt is made
// to spawn a patrol with 20% chance of proceeding." 100 min = 5 days
// (1 in-game day = 20 min), so the wiki-authoritative threshold is
// exactly 5 days. The Pillager page rounds this to "5½" in prose,
// but the Patrol mechanic page is precise.
//
// Old `daysSinceWorldStart < 1` allowed patrols starting on day 1 —
// 4 days earlier than wiki canon, putting raid-banner threats in
// front of brand-new players. Sibling pillager_patrol_spawn_rate.ts
// uses MIN_DAYS_BEFORE_PATROLS = 5; this module now matches.

export interface PatrolCtx {
  daysSinceWorldStart: number;
  distanceFromSpawn: number;
  ticksSinceLastPatrol: number;
  rand: () => number;
}

export const MIN_PATROL_COOLDOWN_TICKS = 2400;
export const MAX_PATROL_COOLDOWN_TICKS = 6000;
export const MIN_DISTANCE_FROM_SPAWN = 64;
export const MIN_DAYS_SINCE_START = 5;

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
