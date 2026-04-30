// Skeleton archer retreat. When the player gets close, skeleton
// strafes backward to maintain optimal bow range (8-15 blocks).

export interface SkeletonAim {
  optimalMin: number;
  optimalMax: number;
  strafeTimerMs: number;
  strafeDir: 1 | -1;
}

export const OPTIMAL_MIN = 8;
export const OPTIMAL_MAX = 15;
export const STRAFE_SWITCH_MS = 2000;

export function makeSkelAim(): SkeletonAim {
  return { optimalMin: OPTIMAL_MIN, optimalMax: OPTIMAL_MAX, strafeTimerMs: 0, strafeDir: 1 };
}

export type MoveIntent = 'close' | 'retreat' | 'strafe' | 'hold';

export interface MoveQuery {
  distance: number;
  losBlocked: boolean;
  nowMs: number;
}

export function planMove(s: SkeletonAim, q: MoveQuery): MoveIntent {
  if (q.losBlocked) return 'close';
  if (q.distance < s.optimalMin) return 'retreat';
  if (q.distance > s.optimalMax) return 'close';
  if (q.nowMs - s.strafeTimerMs >= STRAFE_SWITCH_MS) {
    s.strafeDir = s.strafeDir === 1 ? -1 : 1;
    s.strafeTimerMs = q.nowMs;
  }
  return 'strafe';
}

// Wiki (minecraft.wiki/w/Skeleton): bow drops with an 8.5% base
// chance, and Looting adds 1 percentage point per level (additive,
// not multiplicative). 8.5% / 9.5% / 10.5% / 11.5% at 0/I/II/III.
// Old `0.085 * (1 + level * 0.1)` was a multiplicative ~10% bonus
// per level — by Looting III it gave 11.05% vs wiki 11.5%, and at
// command-given high levels it scaled wildly.
export interface DropQuery {
  lootingLevel: number;
  rand: () => number;
}

export function dropBowChance(q: DropQuery): boolean {
  return q.rand() < 0.085 + q.lootingLevel * 0.01;
}
