// Blast Protection. Wiki (minecraft.wiki/w/Blast_Protection):
//   Damage:    "(8 × level)% reduction" per piece (EPF-stacked, cap 80%)
//   Knockback: Java — "(15 × level)% reduction" per level on each
//              armor piece; stacks across pieces.
//
// Old `knockbackMultiplier` reused the 8%-per-level damage formula —
// at Blast Protection IV the player took ~32% knockback reduction vs
// the wiki's 60%. TNT cannons + creeper-launch rigs were significantly
// less mitigated than canon.
export const PER_LEVEL_REDUCTION = 0.08;
export const PER_LEVEL_KNOCKBACK_REDUCTION = 0.15;
export const MAX_LEVEL = 4;
export const MAX_CAP = 0.8;

export function reduction(level: number): number {
  const l = Math.max(0, Math.min(MAX_LEVEL, level));
  return Math.min(MAX_CAP, l * PER_LEVEL_REDUCTION);
}

export function knockbackMultiplier(level: number): number {
  const l = Math.max(0, level);
  return Math.max(0, 1 - Math.min(1, l * PER_LEVEL_KNOCKBACK_REDUCTION));
}
