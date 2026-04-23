// Mace craft: smithing-table only. Input: heavy_core + breeze_rod.

export interface MaceCraft {
  template: 'none' | 'other';
  heavyCore: boolean;
  breezeRod: boolean;
}

export function canCraft(c: MaceCraft): boolean {
  return c.template === 'none' && c.heavyCore && c.breezeRod;
}

export const MACE_BASE_DAMAGE = 6;
export const MACE_ATTACK_SPEED = 0.9;
export const MACE_DURABILITY = 500;
