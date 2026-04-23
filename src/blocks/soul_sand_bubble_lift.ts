export interface SoulSandCtx {
  waterAbove: boolean;
}

export const UPWARD_FORCE = 0.6;
export const SLOW_MOVEMENT_MULT = 0.4;

export function createsUpwardBubble(c: SoulSandCtx): boolean {
  return c.waterAbove;
}

export function movementSlowdown(): number {
  return SLOW_MOVEMENT_MULT;
}

export function witherSkeletonSkullForWither(countOnTop: number): boolean {
  return countOnTop === 3;
}
