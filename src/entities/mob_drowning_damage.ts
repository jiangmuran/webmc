export interface UnderwaterCtx {
  airSupply: number;
  maxAir: number;
  waterBreathingRemainingTicks: number;
  hasHelmetRespiration: boolean;
}

export function effectiveAirTick(c: UnderwaterCtx): UnderwaterCtx {
  if (c.waterBreathingRemainingTicks > 0) {
    return { ...c, waterBreathingRemainingTicks: c.waterBreathingRemainingTicks - 1 };
  }
  const dec = c.hasHelmetRespiration ? 0.5 : 1;
  return { ...c, airSupply: Math.max(-20, c.airSupply - dec) };
}

export function damageThisTick(c: UnderwaterCtx): number {
  if (c.airSupply >= 0) return 0;
  return -Math.floor(c.airSupply / 20);
}
