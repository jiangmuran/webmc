export interface PatrolInput {
  daysAlive: number;
  lastPatrolMs: number;
  nowMs: number;
  playerOutsideVillage: boolean;
  rng: () => number;
}

export const MIN_DAYS_BEFORE_PATROLS = 3;
export const PATROL_INTERVAL_MS = 20 * 60 * 1000;

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
