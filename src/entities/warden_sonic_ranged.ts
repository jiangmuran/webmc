export const SONIC_RANGE = 20;
export const SONIC_DAMAGE = 10;
export const COOLDOWN_TICKS = 40;

export interface SonicCtx {
  distanceToTarget: number;
  cooldownTicksRemaining: number;
}

export function canFire(c: SonicCtx): boolean {
  return c.distanceToTarget <= SONIC_RANGE && c.cooldownTicksRemaining <= 0;
}

export function damage(c: SonicCtx): number {
  return canFire(c) ? SONIC_DAMAGE : 0;
}

export function ignoresArmor(): boolean {
  return true;
}
