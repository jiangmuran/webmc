// Ladder/vine climbing. While player holds movement toward the ladder,
// vy is clamped to +/- climb speed. Sneaking on ladder holds position.

export interface ClimbCtx {
  onClimbable: boolean;
  wantUp: boolean;
  wantDown: boolean;
  sneaking: boolean;
  vyBeforeClimb: number;
}

export const CLIMB_UP_VY = 0.2;
export const CLIMB_DOWN_VY = -0.15;
export const FALLING_WHILE_CLIMBING_VY = -0.15; // passive slide

export function climbedVY(c: ClimbCtx): number {
  if (!c.onClimbable) return c.vyBeforeClimb;
  if (c.sneaking) return 0;
  if (c.wantUp) return CLIMB_UP_VY;
  if (c.wantDown) return CLIMB_DOWN_VY;
  return FALLING_WHILE_CLIMBING_VY;
}

export function cancelsFallDamage(c: ClimbCtx): boolean {
  return c.onClimbable;
}
