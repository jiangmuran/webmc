export const MAX_MOISTURE = 7;
export const WATER_SEARCH_RADIUS = 4;
export const WATER_SEARCH_DEPTH = 1;

export interface FarmlandCtx {
  moisture: number;
  hasWaterWithin4: boolean;
  isRaining: boolean;
  topBlockIsAir: boolean;
}

export function nextMoisture(c: FarmlandCtx): number {
  if (c.hasWaterWithin4 || c.isRaining) return MAX_MOISTURE;
  return Math.max(0, c.moisture - 1);
}

export function reverts(c: FarmlandCtx): boolean {
  return !c.topBlockIsAir;
}

export function growthRateMult(c: FarmlandCtx): number {
  return c.moisture >= MAX_MOISTURE ? 1 : 0.25;
}
