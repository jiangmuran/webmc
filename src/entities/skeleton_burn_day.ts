export interface SkeletonCtx {
  skyLight: number;
  headInWater: boolean;
  wearingHelmet: boolean;
  isStray: boolean;
  isBogged: boolean;
  isSkeletonHorse: boolean;
}

export const SKYLIGHT_BURN_THRESHOLD = 12;

export function burnsInSunlight(c: SkeletonCtx): boolean {
  if (c.headInWater) return false;
  if (c.wearingHelmet) return false;
  if (c.isSkeletonHorse) return false;
  return c.skyLight >= SKYLIGHT_BURN_THRESHOLD;
}
