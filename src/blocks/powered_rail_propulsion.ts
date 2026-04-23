export interface RailCtx {
  powered: boolean;
  minecartSpeed: number;
  onHill: boolean;
}

export const MAX_SPEED_FLAT = 8;
export const BOOST_POWER = 0.06;
export const DECAY_POWER = 0.5;

export function nextSpeed(c: RailCtx): number {
  if (c.powered) {
    const target = c.onHill ? MAX_SPEED_FLAT * 0.5 : MAX_SPEED_FLAT;
    return Math.min(target, c.minecartSpeed + BOOST_POWER);
  }
  return Math.max(0, c.minecartSpeed * DECAY_POWER);
}

export function powerRange(): number {
  return 9;
}
