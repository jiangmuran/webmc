export type BookshelfSlots = [boolean, boolean, boolean, boolean, boolean, boolean];

// Wiki (minecraft.wiki/w/Chiseled_Bookshelf): the comparator signal
// is the index of the LAST INTERACTED slot (+1), NOT the highest
// occupied slot. Old function returned highest-occupied, which gave
// wrong signals after a book was added and removed across slots.
export function redstoneSignal(slots: BookshelfSlots, lastInteractedSlot: number | null): number {
  if (lastInteractedSlot === null) return 0;
  if (lastInteractedSlot < 0 || lastInteractedSlot >= slots.length) return 0;
  return slots[lastInteractedSlot] !== undefined ? lastInteractedSlot + 1 : 0;
}

export function countBooks(slots: BookshelfSlots): number {
  return slots.filter(Boolean).length;
}
