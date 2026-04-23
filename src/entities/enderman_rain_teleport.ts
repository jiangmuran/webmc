export interface EndermanEnv {
  inRain: boolean;
  inWater: boolean;
  onFire: boolean;
  lastTeleportTicks: number;
}

export const MIN_TELEPORT_INTERVAL = 20;

export function takesDamageFromWater(e: EndermanEnv): boolean {
  return e.inRain || e.inWater;
}

export function shouldTryEscape(e: EndermanEnv): boolean {
  if (!(e.inRain || e.inWater || e.onFire)) return false;
  return e.lastTeleportTicks >= MIN_TELEPORT_INTERVAL;
}

export const RAIN_DAMAGE_PER_TICK = 1 / 20;
