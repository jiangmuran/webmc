// Netherite upgrade via smithing table (1.20+). Needs:
//   - upgrade template (netherite upgrade smithing template)
//   - diamond base item
//   - netherite ingot additive
// Preserves enchantments and custom name; keeps durability percentage.

export type UpgradeBase =
  | 'diamond_sword'
  | 'diamond_pickaxe'
  | 'diamond_axe'
  | 'diamond_shovel'
  | 'diamond_hoe'
  | 'diamond_helmet'
  | 'diamond_chestplate'
  | 'diamond_leggings'
  | 'diamond_boots';

export interface UpgradeInputs {
  template: 'netherite_upgrade' | 'other';
  base: UpgradeBase | 'other';
  additive: 'netherite_ingot' | 'other';
}

export function canUpgrade(i: UpgradeInputs): boolean {
  return (
    i.template === 'netherite_upgrade' && i.additive === 'netherite_ingot' && i.base !== 'other'
  );
}

export function resultId(base: UpgradeBase): string {
  return base.replace('diamond_', 'netherite_');
}

// Wiki (minecraft.wiki/w/Smithing): "the newly crafted netherite gear
// retains the enchantments, name, prior work penalty, and number of
// durability points lost (instead of the remaining durability) from
// the diamond gear."
//
// So preserve the *number of damage points*, not the percentage. Old
// `pct × newMax` applied a percentage that REDUCED effective
// durability after upgrade. Example: a diamond pickaxe (max 1561)
// at 800/1561 ≈ 51% remaining should become a netherite pickaxe
// (max 2031) at 1270 = 2031 − (1561−800) per wiki — which is
// ~63% remaining, NOT the 51% (=1040/2031) the old percentage
// formula gave. The wiki rule effectively REWARDS upgrading damaged
// gear because the new max is bigger but the damage carried over
// is the same absolute count.
//
// Function name kept for back-compat with importers; the
// implementation now matches wiki.
export function preserveDurabilityPct(prev: number, prevMax: number, newMax: number): number {
  const damageLost = prevMax - prev;
  return Math.max(0, newMax - damageLost);
}

export function templateConsumed(): boolean {
  return true;
}
