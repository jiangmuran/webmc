export const DAY_TICKS = 24000;
export const DAY_START = 0;
export const NOON = 6000;
export const SUNSET = 12000;
export const NIGHT = 13000;
export const MIDNIGHT = 18000;
export const SUNRISE = 23000;

export function phase(tick: number): 'day' | 'dusk' | 'night' | 'dawn' {
  const t = ((tick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  if (t < SUNSET) return 'day';
  if (t < NIGHT) return 'dusk';
  if (t < SUNRISE) return 'night';
  return 'dawn';
}

export function isMobSpawnTime(tick: number): boolean {
  const p = phase(tick);
  return p === 'night' || p === 'dusk';
}

export function skyLightForTick(tick: number): number {
  const t = ((tick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  if (t <= 12000) return 15;
  if (t <= 13800) return Math.max(0, Math.floor(15 - (t - 12000) / 120));
  if (t < 22200) return 4;
  return Math.min(15, Math.floor(4 + (t - 22200) / 120));
}
