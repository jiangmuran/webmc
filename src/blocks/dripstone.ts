// Pointed dripstone. A vertical column of dripstone blocks; tip deals
// fall damage scaling with fall distance. Stalagmites grow upward,
// stalactites downward.

export type DripstoneDirection = 'up' | 'down';

export interface DripstoneTip {
  direction: DripstoneDirection;
}

// Fall damage landing on a tip: base + (fall blocks × 2), capped at 40.
export function fallDamageOnTip(fallBlocks: number): number {
  const dmg = Math.floor(2 + fallBlocks * 2);
  return Math.min(40, Math.max(2, dmg));
}

// A stalactite that has a lava source ≤ 11 above it fills a cauldron
// below with lava; water source → fills with water. Returns the fluid
// type to add + interval in seconds between drips.
export type DripFluid = 'water' | 'lava' | null;

export interface DripQuery {
  aboveFluid: DripFluid;
}

export function dripProduced(q: DripQuery): { fluid: DripFluid; intervalSec: number } {
  if (q.aboveFluid === 'water') return { fluid: 'water', intervalSec: 5 };
  if (q.aboveFluid === 'lava') return { fluid: 'lava', intervalSec: 10 };
  return { fluid: null, intervalSec: 0 };
}
