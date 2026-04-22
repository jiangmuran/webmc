// Mob melee attack cooldown. Based on attribute.attack_speed (0.5..5).

export interface AttackCdState {
  attackSpeed: number; // attacks/sec
  lastAttackMs: number;
}

export function makeAttackState(attackSpeed = 2.0): AttackCdState {
  return { attackSpeed, lastAttackMs: -Infinity };
}

export function intervalMs(s: AttackCdState): number {
  return s.attackSpeed <= 0 ? Infinity : 1000 / s.attackSpeed;
}

export function canAttack(s: AttackCdState, nowMs: number): boolean {
  return nowMs - s.lastAttackMs >= intervalMs(s);
}

export function markAttacked(s: AttackCdState, nowMs: number): void {
  s.lastAttackMs = nowMs;
}

// Mob stronger vs weaker via attribute adjust: hasted = x1.5, slowed = x0.5.
export function adjustedSpeed(base: number, haste: boolean, slow: boolean): number {
  let s = base;
  if (haste) s *= 1.5;
  if (slow) s *= 0.5;
  return s;
}
