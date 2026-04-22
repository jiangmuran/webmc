// Chiseled bookshelf. 6 slots, each holds exactly one book-like item.
// Emits a comparator signal based on the most-recently-changed slot.

import type { ItemStack } from '@/items/item';

export interface ChiseledBookshelfState {
  slots: (ItemStack | null)[]; // 6 slots
  lastChangedSlot: number; // -1 = never changed
}

const SLOT_COUNT = 6;

const ACCEPTED_ITEMS = new Set([
  'webmc:book',
  'webmc:written_book',
  'webmc:enchanted_book',
  'webmc:knowledge_book',
  'webmc:writable_book',
]);

export function makeChiseledBookshelf(): ChiseledBookshelfState {
  return {
    slots: Array.from({ length: SLOT_COUNT }, () => null),
    lastChangedSlot: -1,
  };
}

export interface ShelfContext {
  itemName: (itemId: number) => string;
}

export function insertBook(
  state: ChiseledBookshelfState,
  slot: number,
  stack: ItemStack,
  ctx: ShelfContext,
): boolean {
  if (slot < 0 || slot >= SLOT_COUNT) return false;
  if (state.slots[slot]) return false;
  if (!ACCEPTED_ITEMS.has(ctx.itemName(stack.itemId))) return false;
  state.slots[slot] = { ...stack, count: 1 };
  state.lastChangedSlot = slot;
  return true;
}

export function removeBook(state: ChiseledBookshelfState, slot: number): ItemStack | null {
  if (slot < 0 || slot >= SLOT_COUNT) return null;
  const s = state.slots[slot];
  if (!s) return null;
  state.slots[slot] = null;
  state.lastChangedSlot = slot;
  return s;
}

// MC: comparator reads 1..15 based on lastChangedSlot. Empty = 0.
export function comparatorSignal(state: ChiseledBookshelfState): number {
  if (state.lastChangedSlot < 0) return 0;
  return state.lastChangedSlot + 1;
}

export function bookCount(state: ChiseledBookshelfState): number {
  return state.slots.filter((s) => s !== null).length;
}
