export interface SwimCtx {
  inWater: boolean;
  headSubmerged: boolean;
  pressingJump: boolean;
  sprinting: boolean;
}

export const BUOYANCY = 0.04;
export const SWIM_UP = 0.04;
export const SWIM_FORWARD = 0.9;

export function vyAdjustment(c: SwimCtx): number {
  if (!c.inWater) return 0;
  let v = BUOYANCY;
  if (c.pressingJump && c.headSubmerged) v += SWIM_UP;
  return v;
}

export function horizontalMultiplier(c: SwimCtx): number {
  if (!c.inWater) return 1;
  return c.sprinting ? SWIM_FORWARD : 0.8;
}
