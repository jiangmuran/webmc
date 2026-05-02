// Wiki (minecraft.wiki/w/Warden#Sonic_boom): "A warden takes 1.7
// seconds to charge and unleashes the attack ... The attack takes
// an additional 1.3 seconds to cool down before the warden can use
// melee attacks again for a total of 3 seconds." So sonic→next-attack
// cycle is 3 seconds, NOT 5 — the previous 5 s value confused this
// with an unrelated detect-window timer. Sibling warden_sonic_attack
// .ts and warden_sonic.ts now both align on 3 s.
//
// Range here is the legacy spherical bound (20 = far-field of the
// 14h × 20v ovoid in warden_sonic_attack.ts); a strict ovoid check
// lives in that sibling.
export const SONIC_RANGE = 20;
export const SONIC_DAMAGE = 10;
export const COOLDOWN_TICKS = 60;

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
