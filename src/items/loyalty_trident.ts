// Loyalty (trident). Thrown tridents return to the thrower after
// impact or reaching max range. Return speed scales with level.

// Wiki (minecraft.wiki/w/Loyalty): "Once activated, [the trident]
// travels at a maximum speed of ~0.83 blocks per tick at level I,
// ~1.67 blocks per tick at level II, and 2.5 blocks per tick at
// level III. Each level afterwards increases the trident's speed by
// ~0.83 blocks per tick."
//
// Old `0.05 * level` returned 0.05 / 0.10 / 0.15 b/t — about 1/16 of
// canon. Loyalty III tridents took ~17× longer than vanilla to fly
// back. Replaced with the wiki formula `5/6 × level` (≈ 0.833 per
// level).
export const LOYALTY_MAX = 3;
const SPEED_PER_LEVEL = 5 / 6; // ≈ 0.833 b/t per level

export interface LoyaltyCtx {
  level: number;
  throwerAlive: boolean;
  distanceToThrower: number;
}

export function returnSpeedBlocksPerTick(level: number): number {
  return Math.max(0, level) * SPEED_PER_LEVEL;
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
