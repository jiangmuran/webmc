export type BookshelfSlots = [boolean, boolean, boolean, boolean, boolean, boolean];

export function redstoneSignal(slots: BookshelfSlots): number {
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i]) return i + 1;
  }
  return 0;
}

export function countBooks(slots: BookshelfSlots): number {
  return slots.filter(Boolean).length;
}
