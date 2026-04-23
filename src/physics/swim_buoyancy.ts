// Swim buoyancy. In water, vertical velocity is gated by swim input.
// Jumping in water = swim up. Dolphin's grace boosts horizontal speed.

export interface SwimCtx {
  inWater: boolean;
  swimUp: boolean;
  swimDown: boolean;
  depthStrider: number;
  dolphinsGrace: boolean;
  elytraSwimming: boolean;
}

export const WATER_GRAVITY_MULT = 0.2;
export const WATER_DRAG = 0.8;

export function stepVY(vy: number, c: SwimCtx): number {
  if (!c.inWater) return vy;
  let next = vy;
  if (c.swimUp) next += 0.04;
  else if (c.swimDown) next -= 0.04;
  else next += 0.02; // slow buoyant rise
  next = (next - 0.08 * WATER_GRAVITY_MULT) * WATER_DRAG;
  return next;
}

export function horizontalSpeedMult(c: SwimCtx): number {
  let m = 0.8;
  m *= 1 + c.depthStrider * 0.1;
  if (c.dolphinsGrace) m *= 1.5;
  return m;
}

export function canElytraSwim(c: SwimCtx): boolean {
  return c.inWater && c.elytraSwimming;
}
