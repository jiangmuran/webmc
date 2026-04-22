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

// Preserves durability percentage (not absolute), enchantments, custom name.
export function preserveDurabilityPct(prev: number, prevMax: number, newMax: number): number {
  const pct = prev / prevMax;
  return Math.floor(pct * newMax);
}

export function templateConsumed(): boolean {
  return true;
}
