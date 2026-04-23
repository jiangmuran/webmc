// Farmland hydration. Water within 4 blocks hydrates; rain hydrates;
// trampling by jumping reverts to dirt.

export const HYDRATION_RADIUS = 4;
export const DRY_TO_DIRT_TICKS = 40;

export interface FarmlandCtx {
  hasWaterNearby: boolean;
  raining: boolean;
  moistureLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function hydrated(c: FarmlandCtx): boolean {
  return c.moistureLevel >= 1;
}

export function tick(c: FarmlandCtx): FarmlandCtx {
  if (c.hasWaterNearby || c.raining) return { ...c, moistureLevel: 7 };
  if (c.moistureLevel > 0)
    return { ...c, moistureLevel: (c.moistureLevel - 1) as FarmlandCtx['moistureLevel'] };
  return c;
}

export function tramplesToDirt(fallDistance: number): boolean {
  return fallDistance >= 0.5;
}
