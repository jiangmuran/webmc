// Chiseled bookshelf. 6 slots; each slot can hold 1 book or book-like
// item. Comparator output reads the SLOT INDEX most recently interacted
// with, not the total count — unique among containers.

export type BookItem =
  | 'webmc:book'
  | 'webmc:enchanted_book'
  | 'webmc:written_book'
  | 'webmc:writable_book'
  | 'webmc:knowledge_book';

export interface BookshelfState {
  slots: (BookItem | null)[]; // length 6
  lastInteractedSlot: number; // 0..5, -1 if none
}

export function makeBookshelf(): BookshelfState {
  return {
    slots: [null, null, null, null, null, null],
    lastInteractedSlot: -1,
  };
}

export interface InteractQuery {
  slot: number;
  holdingBook: BookItem | null;
}

export type InteractResult =
  | { kind: 'inserted'; newState: BookshelfState }
  | { kind: 'extracted'; extractedItem: BookItem }
  | { kind: 'no_change' };

export function interactSlot(state: BookshelfState, q: InteractQuery): InteractResult {
  if (q.slot < 0 || q.slot >= 6) return { kind: 'no_change' };
  const current = state.slots[q.slot] ?? null;
  if (current === null) {
    if (!q.holdingBook) return { kind: 'no_change' };
    state.slots[q.slot] = q.holdingBook;
    state.lastInteractedSlot = q.slot;
    return { kind: 'inserted', newState: state };
  }
  // Extract the book.
  state.slots[q.slot] = null;
  state.lastInteractedSlot = q.slot;
  return { kind: 'extracted', extractedItem: current };
}

// Comparator output = last-interacted slot + 1 (range 1..6; 0 if never
// interacted).
export function comparatorSignal(state: BookshelfState): number {
  return state.lastInteractedSlot < 0 ? 0 : state.lastInteractedSlot + 1;
}

// Enchantment-table power: a chiseled bookshelf contributes 1 power per
// book slot filled (matches regular bookshelf if full).
export function enchantmentPower(state: BookshelfState): number {
  let n = 0;
  for (const s of state.slots) if (s !== null) n++;
  return n;
}

// Breaking drops all contained books.
export function breakBookshelf(state: BookshelfState): { item: string; count: number }[] {
  const drops: { item: string; count: number }[] = [{ item: 'webmc:chiseled_bookshelf', count: 1 }];
  for (const s of state.slots) {
    if (s !== null) drops.push({ item: s, count: 1 });
  }
  return drops;
}
