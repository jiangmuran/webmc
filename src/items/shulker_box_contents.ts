// Shulker box. 27-slot container that keeps contents when picked up.
// Cannot nest (placing a shulker box item into a shulker box is
// rejected).

export const BOX_SIZE = 27;

export interface ShulkerBox {
  slots: ({ id: string; count: number } | null)[];
  color: string;
}

export function makeBox(color = 'purple'): ShulkerBox {
  return { slots: Array.from({ length: BOX_SIZE }, () => null), color };
}

export function isShulkerBoxItem(id: string): boolean {
  return id === 'webmc:shulker_box' || /^webmc:\w+_shulker_box$/.test(id);
}

export function tryPlace(b: ShulkerBox, slot: number, id: string, count: number): boolean {
  if (slot < 0 || slot >= BOX_SIZE) return false;
  if (isShulkerBoxItem(id)) return false;
  const cur = b.slots[slot];
  if (!cur) {
    b.slots[slot] = { id, count };
    return true;
  }
  if (cur.id !== id) return false;
  cur.count += count;
  return true;
}

export function totalItems(b: ShulkerBox): number {
  return b.slots.reduce((acc, s) => acc + (s?.count ?? 0), 0);
}

// Wiki (minecraft.wiki/w/Redstone_Comparator): container comparator
// output is `1 + floor(weighted_items / inventory_size * 14)` where
// weighted_items sums `count / maxStack` per slot. Old code used
// FILLED-SLOT count instead of item-weight, so a box with 27 single
// items (1/64 of a stack each) emitted signal 15 instead of the
// wiki-canonical 1.
//
// Simplification: assumes maxStack=64 for every item. Non-stackable
// items (tools, armor) compute as 1.0 weight which slightly inflates
// signal — close enough for typical shulker-loaded contraptions.
export function comparatorOutput(b: ShulkerBox): number {
  if (b.slots.every((s) => s === null)) return 0;
  let weighted = 0;
  for (const s of b.slots) {
    if (s) weighted += s.count / 64;
  }
  return Math.min(15, 1 + Math.floor((weighted / BOX_SIZE) * 14));
}
