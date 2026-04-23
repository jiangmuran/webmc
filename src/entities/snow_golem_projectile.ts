export interface SnowGolemCtx {
  targetDistance: number;
  inWarmBiome: boolean;
  inRain: boolean;
  hp: number;
}

export const RANGE = 10;
export const MELT_DAMAGE_PER_TICK = 1;

export function canThrow(c: SnowGolemCtx): boolean {
  return c.targetDistance <= RANGE && c.hp > 0;
}

export function takesMeltDamage(c: SnowGolemCtx): boolean {
  return c.inWarmBiome || c.inRain;
}

export function leavesSnowTrail(): boolean {
  return true;
}
