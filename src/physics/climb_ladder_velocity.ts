export interface ClimbCtx {
  onLadder: boolean;
  onVine: boolean;
  onScaffolding: boolean;
  sneaking: boolean;
  pressingUp: boolean;
  pressingDown: boolean;
}

export const CLIMB_UP = 0.2;
export const CLIMB_DOWN = -0.15;
export const HOLD_STILL_GRAVITY = 0;

export function verticalVelocity(c: ClimbCtx): number {
  const climbing = c.onLadder || c.onVine || c.onScaffolding;
  if (!climbing) return -0.08;
  if (c.sneaking) return HOLD_STILL_GRAVITY;
  if (c.pressingUp) return CLIMB_UP;
  if (c.pressingDown) return CLIMB_DOWN;
  return HOLD_STILL_GRAVITY;
}
