export interface AttackCtx {
  falling: boolean;
  sprinting: boolean;
  onGround: boolean;
  inWater: boolean;
  hasAnyEffect: boolean;
}

export const CRIT_DAMAGE_MULT = 1.5;

export function isCrit(a: AttackCtx): boolean {
  if (a.sprinting) return false;
  if (a.onGround) return false;
  if (a.inWater) return false;
  if (a.hasAnyEffect) return false;
  return a.falling;
}

export function damageWithCrit(base: number, a: AttackCtx): number {
  return isCrit(a) ? base * CRIT_DAMAGE_MULT : base;
}
