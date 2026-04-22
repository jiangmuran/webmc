// Snow golem. Formed by placing a pumpkin on two snow blocks. Throws
// snowballs at nearest hostile. Melts in warm biomes, burns in rain.

export interface SnowGolem {
  hp: number;
  pumpkinCarved: boolean;
  meltTicks: number;
}

export const MAX_HP = 4;
export const MELT_DAMAGE_INTERVAL = 40;
export const RAIN_DAMAGE_INTERVAL = 20;

export function makeSnowGolem(pumpkinCarved = true): SnowGolem {
  return { hp: MAX_HP, pumpkinCarved, meltTicks: 0 };
}

export interface EnvironmentQuery {
  biomeTemperature: number;
  inRain: boolean;
  inWater: boolean;
  onFire: boolean;
}

export function damagePerTick(q: EnvironmentQuery, nowTick: number): number {
  if (q.inWater || q.onFire) return 1;
  if (q.biomeTemperature > 0.9 || q.inRain) {
    const interval = q.inRain ? RAIN_DAMAGE_INTERVAL : MELT_DAMAGE_INTERVAL;
    return nowTick % interval === 0 ? 1 : 0;
  }
  return 0;
}

// Trail of snow layers on dirt/grass.
export function shouldLeaveSnowTrail(q: EnvironmentQuery): boolean {
  return q.biomeTemperature <= 0.8 && !q.inRain;
}

// Snowball damage: minimal vs most, 3 HP vs blaze.
export function snowballDamage(targetType: string): number {
  if (targetType === 'blaze') return 3;
  return 0;
}
