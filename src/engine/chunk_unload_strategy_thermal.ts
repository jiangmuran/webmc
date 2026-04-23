export interface ThermalCtx {
  cpuTempCelsius: number;
  fpsP95: number;
  battery: number;
}

export const HOT_CPU = 75;
export const LOW_FPS = 25;
export const LOW_BATTERY = 0.2;

export function inThermalThrottle(c: ThermalCtx): boolean {
  return c.cpuTempCelsius > HOT_CPU || c.fpsP95 < LOW_FPS || c.battery < LOW_BATTERY;
}

export function suggestedChunkRadius(c: ThermalCtx, normalRadius: number): number {
  return inThermalThrottle(c) ? Math.max(4, normalRadius - 4) : normalRadius;
}
