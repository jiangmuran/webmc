// Power (bow). +25% * (level + 1) damage per arrow, rounded up to 0.5.

export const POWER_MAX_LEVEL = 5;

export function damageMultiplier(level: number): number {
  if (level <= 0) return 1;
  const eff = Math.min(POWER_MAX_LEVEL, level);
  return 1 + 0.25 * (eff + 1);
}

export function bonusDamage(baseDamage: number, level: number): number {
  return baseDamage * (damageMultiplier(level) - 1);
}
