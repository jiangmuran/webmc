// Sprint attack. When attacker is sprinting at full attack charge
// and attack does not crit, it deals extra knockback (sweep) but no
// damage bonus. Sprint disables critical.

export interface AttackCtx {
  sprinting: boolean;
  airborne: boolean;
  falling: boolean;
  onLadder: boolean;
  inWater: boolean;
  fullyCharged: boolean;
  blindOrSlow: boolean;
}

export function isCritical(c: AttackCtx): boolean {
  if (c.sprinting) return false;
  if (!c.fullyCharged) return false;
  if (!c.falling) return false;
  if (c.onLadder || c.inWater) return false;
  if (c.blindOrSlow) return false;
  return c.airborne;
}

export function critMultiplier(): number {
  return 1.5;
}

export function sprintKnockbackBoost(c: AttackCtx): boolean {
  return c.sprinting && c.fullyCharged;
}
