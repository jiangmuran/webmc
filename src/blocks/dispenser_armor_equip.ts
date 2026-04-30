// Dispenser: when it dispenses wearable armor at a player, the armor
// is equipped rather than spawned as item (if slot empty).

export type ArmorSlot = 'helmet' | 'chestplate' | 'leggings' | 'boots';

// Wiki (minecraft.wiki/w/Dispenser): "A dispenser equips wearable
// armor on a player or armor stand directly in front of it." All
// six full armor tiers — leather, chainmail, iron, gold, diamond,
// netherite — plus turtle helmet and elytra (chestplate slot) are
// equippable. Old table had only leather helmet (missing the
// chestplate/leggings/boots) and was missing the gold and
// chainmail tiers entirely, plus turtle helmet and elytra.
const SLOT_BY_ITEM: Record<string, ArmorSlot> = {
  // Leather
  leather_helmet: 'helmet',
  leather_chestplate: 'chestplate',
  leather_leggings: 'leggings',
  leather_boots: 'boots',
  // Chainmail
  chainmail_helmet: 'helmet',
  chainmail_chestplate: 'chestplate',
  chainmail_leggings: 'leggings',
  chainmail_boots: 'boots',
  // Iron
  iron_helmet: 'helmet',
  iron_chestplate: 'chestplate',
  iron_leggings: 'leggings',
  iron_boots: 'boots',
  // Gold
  golden_helmet: 'helmet',
  golden_chestplate: 'chestplate',
  golden_leggings: 'leggings',
  golden_boots: 'boots',
  // Diamond
  diamond_helmet: 'helmet',
  diamond_chestplate: 'chestplate',
  diamond_leggings: 'leggings',
  diamond_boots: 'boots',
  // Netherite
  netherite_helmet: 'helmet',
  netherite_chestplate: 'chestplate',
  netherite_leggings: 'leggings',
  netherite_boots: 'boots',
  // Turtle helmet (helmet slot, also grants Water Breathing)
  turtle_helmet: 'helmet',
  // Elytra slots into chestplate
  elytra: 'chestplate',
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
