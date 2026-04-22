import { describe, it, expect } from 'vitest';
import {
  bookCount,
  comparatorSignal,
  insertBook,
  makeChiseledBookshelf,
  removeBook,
} from './chiseled_bookshelf';
import type { ItemStack } from '@/items/item';

const itemName = (id: number): string => {
  if (id === 1) return 'webmc:book';
  if (id === 2) return 'webmc:enchanted_book';
  if (id === 99) return 'webmc:stone';
  return 'unknown';
};

describe('chiseled bookshelf', () => {
  it('holds up to 6 books', () => {
    const s = makeChiseledBookshelf();
    for (let i = 0; i < 6; i++) {
      const stack: ItemStack = { itemId: 1, count: 1, damage: 0 };
      expect(insertBook(s, i, stack, { itemName })).toBe(true);
    }
    expect(bookCount(s)).toBe(6);
  });

  it('refuses non-book items', () => {
    const s = makeChiseledBookshelf();
    const stack: ItemStack = { itemId: 99, count: 1, damage: 0 };
    expect(insertBook(s, 0, stack, { itemName })).toBe(false);
  });

  it('refuses inserting into an occupied slot', () => {
    const s = makeChiseledBookshelf();
    const stack: ItemStack = { itemId: 1, count: 1, damage: 0 };
    insertBook(s, 0, stack, { itemName });
    expect(insertBook(s, 0, stack, { itemName })).toBe(false);
  });

  it('comparator signal tracks last changed slot', () => {
    const s = makeChiseledBookshelf();
    insertBook(s, 3, { itemId: 1, count: 1, damage: 0 }, { itemName });
    expect(comparatorSignal(s)).toBe(4);
    removeBook(s, 3);
    expect(comparatorSignal(s)).toBe(4); // still tracks the slot index
  });

  it('removeBook returns the stack', () => {
    const s = makeChiseledBookshelf();
    insertBook(s, 0, { itemId: 2, count: 1, damage: 0 }, { itemName });
    const out = removeBook(s, 0);
    expect(out?.itemId).toBe(2);
  });
});
