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

// Comparator output based on fullness (like normal container).
export function comparatorOutput(b: ShulkerBox): number {
  const filledFraction = b.slots.filter((s) => s !== null).length / BOX_SIZE;
  if (filledFraction === 0) return 0;
  return Math.min(15, Math.floor(filledFraction * 14) + 1);
}
