export interface ConduitCtx {
  powerActive: boolean;
  distance: number;
  inWaterOrRain: boolean;
}

export const POWER_RANGE = 96;

export function grantsWaterBreathing(c: ConduitCtx): boolean {
  return c.powerActive && c.distance <= POWER_RANGE && c.inWaterOrRain;
}

export function grantsHaste(c: ConduitCtx): boolean {
  return grantsWaterBreathing(c);
}

export function grantsNightVision(c: ConduitCtx): boolean {
  return grantsWaterBreathing(c);
}
