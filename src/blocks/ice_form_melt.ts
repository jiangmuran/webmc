// Ice forms on exposed water in cold biomes at night; melts near light.

export interface IceCtx {
  biomeTemperature: number;
  isNight: boolean;
  hasSkyLight: boolean;
  nearbyWarmBlock: boolean;
  lightLevel: number;
}

export const COLD_THRESHOLD = 0.15;

export function shouldFreezeWater(c: IceCtx): boolean {
  if (c.biomeTemperature > COLD_THRESHOLD) return false;
  if (!c.hasSkyLight) return false;
  if (c.lightLevel > 11) return false;
  return c.isNight;
}

export function shouldMeltIce(c: IceCtx): boolean {
  if (c.nearbyWarmBlock) return true;
  if (c.biomeTemperature > 0.5) return true;
  return c.lightLevel > 11;
}

export const FREEZE_RANDOM_TICK_CHANCE = 0.25;
