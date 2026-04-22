// Attack indicator. Shows a cooldown meter that fills after each swing
// based on the weapon's attack speed attribute.

export interface AttackCdState {
  lastSwingMs: number;
  attackSpeed: number; // attacks per second (e.g. 1.6)
}

export function makeAttackState(attackSpeed = 4): AttackCdState {
  return { lastSwingMs: -Infinity, attackSpeed };
}

export function swing(s: AttackCdState, nowMs: number): number {
  s.lastSwingMs = nowMs;
  return 1;
}

export function cooldownFraction(s: AttackCdState, nowMs: number): number {
  if (s.attackSpeed <= 0) return 1;
  const intervalMs = 1000 / s.attackSpeed;
  const elapsed = nowMs - s.lastSwingMs;
  return Math.max(0, Math.min(1, elapsed / intervalMs));
}

// Attack damage multiplier based on cooldown (0% at 0 cd, 100% at full).
export function damageMultiplier(s: AttackCdState, nowMs: number): number {
  const f = cooldownFraction(s, nowMs);
  if (f <= 0) return 0.2;
  return 0.2 + 0.8 * f;
}
