export const POWERED_RAIL_TRACTION_BLOCKS = 8;
export const MAX_POWERED_SPEED = 0.4;
export const RAIL_FRICTION_PER_TICK = 0.996;

export interface PoweredRailInput {
  rails: number;
  isPowered: boolean;
  currentSpeed: number;
  passenger: boolean;
}

export function accelerationPerTick(i: PoweredRailInput): number {
  if (!i.isPowered) return 0;
  return i.passenger ? 0.06 : 0.02;
}

export function effectiveTopSpeed(_i: PoweredRailInput): number {
  return MAX_POWERED_SPEED;
}

export function brakeForUnpowered(currentSpeed: number, isPowered: boolean): number {
  if (isPowered) return currentSpeed;
  return currentSpeed * 0.5;
}
