export interface PatrolInput {
  daysAlive: number;
  lastPatrolMs: number;
  nowMs: number;
  playerOutsideVillage: boolean;
  rng: () => number;
}

// Wiki (minecraft.wiki/w/Patrol#Conditions): "Patrols spawn naturally
// after the world age reaches 100 minutes (5 in-game days), then
// after a delay of 10–11 minutes ... an attempt is made to spawn a
// patrol with 20% chance of proceeding."
//
// Old constants:
//   MIN_DAYS_BEFORE_PATROLS = 3 — wiki: 5 days
//   PATROL_INTERVAL_MS = 20 minutes — wiki: ~10-11 minutes
// Patrols started spawning 2 days too early at half the wiki
// frequency. The 20% rng gate matches wiki.
export const MIN_DAYS_BEFORE_PATROLS = 5;
// 11 minutes (matches the upper bound of the wiki's 10–11 min window).
export const PATROL_INTERVAL_MS = 11 * 60 * 1000;

export function canSpawnPatrol(i: PatrolInput): boolean {
  if (i.daysAlive < MIN_DAYS_BEFORE_PATROLS) return false;
  if (!i.playerOutsideVillage) return false;
  return i.nowMs - i.lastPatrolMs >= PATROL_INTERVAL_MS && i.rng() < 0.2;
}

export function patrolSize(rng: () => number): number {
  return 2 + Math.floor(rng() * 4);
}

export function captainChance(): number {
  return 1;
}
