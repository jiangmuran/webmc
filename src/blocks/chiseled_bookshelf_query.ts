// Chiseled bookshelf. 6 slots. Holds books/enchanted books/written
// books. Comparator reads from last-interacted slot (1..6 signal).

export interface ChiseledBookshelf {
  slots: (string | null)[]; // 6 slots
  lastInteractedSlot: number; // 0..5, -1 = none
}

export const SLOT_COUNT = 6;

export function makeShelf(): ChiseledBookshelf {
  return {
    slots: [null, null, null, null, null, null],
    lastInteractedSlot: -1,
  };
}

const ACCEPTED = new Set<string>([
  'webmc:book',
  'webmc:enchanted_book',
  'webmc:written_book',
  'webmc:writable_book',
]);

export function canHold(id: string): boolean {
  return ACCEPTED.has(id);
}

export function insert(s: ChiseledBookshelf, slot: number, itemId: string): boolean {
  if (slot < 0 || slot >= SLOT_COUNT) return false;
  if (!canHold(itemId)) return false;
  if (s.slots[slot] !== null) return false;
  s.slots[slot] = itemId;
  s.lastInteractedSlot = slot;
  return true;
}

export function take(s: ChiseledBookshelf, slot: number): string | null {
  if (slot < 0 || slot >= SLOT_COUNT) return null;
  const cur = s.slots[slot];
  if (cur === null) return null;
  s.slots[slot] = null;
  s.lastInteractedSlot = slot;
  return cur ?? null;
}

export function comparatorOutput(s: ChiseledBookshelf): number {
  if (s.lastInteractedSlot < 0) return 0;
  return s.lastInteractedSlot + 1;
}
