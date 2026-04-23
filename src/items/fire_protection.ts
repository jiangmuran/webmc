export const PER_LEVEL_REDUCTION = 0.08;
export const MAX_LEVEL = 4;
export const BURN_TIME_FRACTION_PER_LEVEL = 0.15;

export function damageReduction(level: number): number {
  const l = Math.max(0, Math.min(MAX_LEVEL, level));
  return l * PER_LEVEL_REDUCTION;
}

export function burnTimeReduction(level: number): number {
  return Math.min(1, level * BURN_TIME_FRACTION_PER_LEVEL);
}
