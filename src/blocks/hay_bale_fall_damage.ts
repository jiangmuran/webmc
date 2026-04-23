export const HAY_FALL_DAMAGE_REDUCTION = 0.8;

export function fallDamageMultiplier(): number {
  return 1 - HAY_FALL_DAMAGE_REDUCTION;
}

export function effectiveFallDamage(raw: number): number {
  return Math.max(0, raw * fallDamageMultiplier());
}

export function growthAccelForBaby(): number {
  return 20;
}
