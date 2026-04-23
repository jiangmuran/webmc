export interface ClimbCtx {
  distanceFromBase: number;
  sneaking: boolean;
  pressingUp: boolean;
  pressingDown: boolean;
}

export const MAX_SUPPORT_DISTANCE = 6;
export const CLIMB_UP_VEL = 0.2;
export const CLIMB_DOWN_VEL = -0.15;

export function isSupported(c: ClimbCtx): boolean {
  return c.distanceFromBase <= MAX_SUPPORT_DISTANCE;
}

export function verticalVelocity(c: ClimbCtx): number {
  if (c.sneaking) return 0;
  if (c.pressingUp) return CLIMB_UP_VEL;
  if (c.pressingDown) return CLIMB_DOWN_VEL;
  return 0;
}
