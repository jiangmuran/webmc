// Zombie/skeleton/drowned sun burning. In direct daylight, takes 1 HP
// every 20 ticks. Water, shade, helmet, pumpkin-on-head prevent burn.

export interface BurnQuery {
  inDirectSunlight: boolean;
  inWater: boolean;
  wearsHelmetOrPumpkin: boolean;
}

export function shouldBurn(q: BurnQuery): boolean {
  if (!q.inDirectSunlight) return false;
  if (q.inWater) return false;
  if (q.wearsHelmetOrPumpkin) return false;
  return true;
}

export const BURN_INTERVAL_TICKS = 20;
export const BURN_DAMAGE = 1;

export function burnDamageThisTick(tickInSun: number, q: BurnQuery): number {
  if (!shouldBurn(q)) return 0;
  return tickInSun % BURN_INTERVAL_TICKS === 0 ? BURN_DAMAGE : 0;
}

// Fire ticks remaining: as long as burning, have 8 fire ticks applied.
export function fireTicksOnBurn(q: BurnQuery): number {
  return shouldBurn(q) ? 8 : 0;
}

// Helmet durability hit: the helmet takes damage while preventing burn.
export const HELMET_DMG_INTERVAL_TICKS = 100;

export function helmetDamagePerTick(tickInSun: number, q: BurnQuery): number {
  if (!q.wearsHelmetOrPumpkin) return 0;
  if (!q.inDirectSunlight) return 0;
  return tickInSun % HELMET_DMG_INTERVAL_TICKS === 0 ? 1 : 0;
}
