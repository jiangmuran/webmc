// Wiki (minecraft.wiki/w/Warden#Attacks): "Sonic Boom is a ranged
// attack with a 5-second (100-tick) cooldown that deals 10 damage
// and ignores armor/shield." Old COOLDOWN_TICKS = 40 (2 s) was 2.5×
// faster than the wiki, letting the boss fire sonic booms every
// 2 s instead of 5 s. Sibling warden_sonic_attack.ts already uses
// 5000 ms — this aligns the second copy.
export const SONIC_RANGE = 20;
export const SONIC_DAMAGE = 10;
export const COOLDOWN_TICKS = 100;

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
