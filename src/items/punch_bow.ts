// Punch (bow). Increases arrow knockback by level (1 extra block
// per level).

export const PUNCH_MAX = 2;

export function knockbackStrength(level: number): number {
  return Math.max(0, Math.min(PUNCH_MAX, level));
}

export function totalKnockback(baseArrowKnockback: number, level: number): number {
  return baseArrowKnockback + knockbackStrength(level);
}
