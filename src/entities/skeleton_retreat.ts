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

// Armored / enchanted skeleton drops: on looting, bow may have durability left.
export interface DropQuery {
  lootingLevel: number;
  rand: () => number;
}

export function dropBowChance(q: DropQuery): boolean {
  return q.rand() < 0.085 * (1 + q.lootingLevel * 0.1);
}
