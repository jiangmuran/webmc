export interface AttackCooldownState {
  ticksSinceLastSwing: number;
  cooldownDurationTicks: number;
}

export function attackCooldownFraction(s: AttackCooldownState): number {
  if (s.cooldownDurationTicks <= 0) return 1;
  return Math.min(1, s.ticksSinceLastSwing / s.cooldownDurationTicks);
}

export function fullPowerReady(s: AttackCooldownState): boolean {
  return attackCooldownFraction(s) >= 0.9;
}

export function ringAlpha(s: AttackCooldownState): number {
  return Math.min(1, attackCooldownFraction(s));
}
