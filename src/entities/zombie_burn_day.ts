export interface ZombieCtx {
  skyLight: number;
  headInWater: boolean;
  wearingHelmet: boolean;
  isHusk: boolean;
  isDrowned: boolean;
}

export const SKY_BURN = 12;

export function burnsInSunlight(c: ZombieCtx): boolean {
  if (c.isHusk) return false;
  if (c.isDrowned) return false;
  if (c.headInWater) return false;
  if (c.wearingHelmet) return false;
  return c.skyLight >= SKY_BURN;
}
