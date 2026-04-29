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

// Wiki: enderman takes 1 damage every 10 ticks (0.5s) in water/rain,
// matching fire damage rate. Old constant was 1/20 (1 HP/s) — half
// the wiki rate.
export const RAIN_DAMAGE_PER_TICK = 1 / 10;
