// Loyalty (trident). Thrown tridents return to the thrower after
// impact or reaching max range. Return speed scales with level.

export const LOYALTY_MAX = 3;

export interface LoyaltyCtx {
  level: number;
  throwerAlive: boolean;
  distanceToThrower: number;
}

export function returnSpeedBlocksPerTick(level: number): number {
  return 0.05 * Math.max(0, Math.min(LOYALTY_MAX, level));
}

export function shouldReturn(c: LoyaltyCtx): boolean {
  return c.level > 0 && c.throwerAlive;
}

// Loyalty trident does not despawn; it returns even if dropped in void
// (respawns at thrower in MC logic). Incompatible with Riptide.
export function incompatibleWithRiptide(): boolean {
  return true;
}

export function eta(c: LoyaltyCtx): number {
  const s = returnSpeedBlocksPerTick(c.level);
  if (s <= 0) return Infinity;
  return c.distanceToThrower / s;
}
