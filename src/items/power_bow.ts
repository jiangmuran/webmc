// Power (bow). +25% * (level + 1) damage per arrow, rounded up to the
// nearest half-heart per minecraft.wiki/w/Power.
//
// Damage in MC is in HP units = half-hearts, so "rounded up to nearest
// half-heart" = Math.ceil. Old `bonusDamage` returned the raw
// multiplication without rounding, so e.g. a base-5 arrow with Power
// IV got 6.25 bonus instead of the wiki-canonical ceil(6.25) = 7.
// Sibling arrow_critical.ts and arrow_trajectory.ts already apply
// Math.ceil.

export const POWER_MAX_LEVEL = 5;

export function damageMultiplier(level: number): number {
  if (level <= 0) return 1;
  const eff = Math.min(POWER_MAX_LEVEL, level);
  return 1 + 0.25 * (eff + 1);
}

export function bonusDamage(baseDamage: number, level: number): number {
  if (level <= 0) return 0;
  return Math.ceil(baseDamage * 0.25 * (Math.min(POWER_MAX_LEVEL, level) + 1));
}
