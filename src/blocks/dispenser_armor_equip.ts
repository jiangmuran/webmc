// Dispenser: when it dispenses wearable armor at a player, the armor
// is equipped rather than spawned as item (if slot empty).

export type ArmorSlot = 'helmet' | 'chestplate' | 'leggings' | 'boots';

const SLOT_BY_ITEM: Record<string, ArmorSlot> = {
  leather_helmet: 'helmet',
  iron_helmet: 'helmet',
  diamond_helmet: 'helmet',
  netherite_helmet: 'helmet',
  iron_chestplate: 'chestplate',
  diamond_chestplate: 'chestplate',
  netherite_chestplate: 'chestplate',
  iron_leggings: 'leggings',
  diamond_leggings: 'leggings',
  netherite_leggings: 'leggings',
  iron_boots: 'boots',
  diamond_boots: 'boots',
  netherite_boots: 'boots',
};

export function slotOf(itemId: string): ArmorSlot | null {
  return SLOT_BY_ITEM[itemId] ?? null;
}

export interface EquipCtx {
  facingPlayerId: string | null;
  slotEmpty: boolean;
  itemId: string;
}

export type EquipResult = { kind: 'equipped' } | { kind: 'ejected_item' };

export function dispense(c: EquipCtx): EquipResult {
  if (!c.facingPlayerId) return { kind: 'ejected_item' };
  if (!c.slotEmpty) return { kind: 'ejected_item' };
  if (slotOf(c.itemId) === null) return { kind: 'ejected_item' };
  return { kind: 'equipped' };
}
