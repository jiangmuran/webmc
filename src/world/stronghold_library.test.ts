import { describe, it, expect } from 'vitest';
import {
  rollBookshelfCount,
  rollEnchantedBook,
  hasTwoFloors,
  LIBRARY_BOOKSHELF_COUNT_RANGE,
  LIBRARY_LOOT_POOL,
} from './stronghold_library';

describe('stronghold library', () => {
  it('bookshelf count in range', () => {
    for (let i = 0; i < 50; i++) {
      const n = rollBookshelfCount(Math.random);
      expect(n).toBeGreaterThanOrEqual(LIBRARY_BOOKSHELF_COUNT_RANGE.min);
      expect(n).toBeLessThanOrEqual(LIBRARY_BOOKSHELF_COUNT_RANGE.max);
    }
  });

  it('book in pool', () => {
    expect(LIBRARY_LOOT_POOL).toContain(rollEnchantedBook(Math.random));
  });

  it('two floors sometimes', () => {
    let double = false;
    for (let i = 0; i < 20; i++) if (hasTwoFloors(Math.random)) double = true;
    expect(double).toBe(true);
  });
});
