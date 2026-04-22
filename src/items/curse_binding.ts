// Curse of Binding. Armor with this enchantment cannot be removed from
// the armor slot unless the player dies (and the armor drops) or the
// armor breaks.

export interface BoundArmorCtx {
  hasCurse: boolean;
  playerDead: boolean;
  armorBroken: boolean;
  isCreative: boolean;
}

export function canUnequip(c: BoundArmorCtx): boolean {
  if (c.isCreative) return true;
  if (!c.hasCurse) return true;
  return c.playerDead || c.armorBroken;
}

export function removableByGrindstone(): boolean {
  return false;
}

// Binding applies only to armor slots.
export function appliesToSlot(slot: string): boolean {
  return (
    slot === 'helmet' ||
    slot === 'chestplate' ||
    slot === 'leggings' ||
    slot === 'boots' ||
    slot === 'elytra'
  );
}
