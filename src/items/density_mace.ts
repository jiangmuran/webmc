// Density (mace-only). Adds +0.5 * level damage per block fallen
// during a smash attack.

export const DENSITY_MAX = 5;

export function bonusPerFallBlock(level: number): number {
  return 0.5 * Math.max(0, Math.min(DENSITY_MAX, level));
}

export function totalBonus(level: number, fallDistance: number): number {
  return bonusPerFallBlock(level) * Math.max(0, fallDistance);
}

export function appliesOnlyTo(itemKind: string): boolean {
  return itemKind === 'mace';
}
