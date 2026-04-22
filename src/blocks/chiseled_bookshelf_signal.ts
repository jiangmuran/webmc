// Chiseled bookshelf: emits redstone comparator signal based on
// last book inserted/removed (slot 0..5 → signal 1..6).

export interface ChiseledBookshelf {
  slots: (string | null)[]; // length 6
  lastModifiedSlot: number | null; // 0..5 or null
}

export function makeBookshelf(): ChiseledBookshelf {
  return {
    slots: [null, null, null, null, null, null],
    lastModifiedSlot: null,
  };
}

export function comparatorSignal(b: ChiseledBookshelf): number {
  if (b.lastModifiedSlot === null) return 0;
  return b.lastModifiedSlot + 1;
}

export function placeBook(b: ChiseledBookshelf, slot: number, book: string): boolean {
  if (slot < 0 || slot >= 6) return false;
  if (b.slots[slot] !== null) return false;
  b.slots[slot] = book;
  b.lastModifiedSlot = slot;
  return true;
}

export function takeBook(b: ChiseledBookshelf, slot: number): string | null {
  if (slot < 0 || slot >= 6) return null;
  const out = b.slots[slot] ?? null;
  if (out === null) return null;
  b.slots[slot] = null;
  b.lastModifiedSlot = slot;
  return out;
}
