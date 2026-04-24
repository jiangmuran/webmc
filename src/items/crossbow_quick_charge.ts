export const BASE_CROSSBOW_CHARGE_TICKS = 25;

export function chargeTicksWithEnchant(quickChargeLevel: number): number {
  const reduction = 5 * Math.max(0, Math.min(5, quickChargeLevel));
  return Math.max(1, BASE_CROSSBOW_CHARGE_TICKS - reduction);
}

export interface ChargedCrossbow {
  loaded: boolean;
  projectile?: 'arrow' | 'firework_rocket';
}

export function chargeCrossbow(
  c: ChargedCrossbow,
  projectile: 'arrow' | 'firework_rocket',
): ChargedCrossbow {
  return { loaded: true, projectile };
}

export function shoot(c: ChargedCrossbow): {
  empty: ChargedCrossbow;
  fired?: 'arrow' | 'firework_rocket';
} {
  if (!c.loaded) return { empty: c };
  return { empty: { loaded: false }, fired: c.projectile };
}
