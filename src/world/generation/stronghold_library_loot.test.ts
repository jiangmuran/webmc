import { describe, it, expect } from 'vitest';
import { shelfCount, hasEnchantedBookLoot, bookshelfAreaRadius } from './stronghold_library_loot';

describe('stronghold library loot', () => {
  it('max shelf power', () => {
    expect(shelfCount()).toBe(15);
  });

  it('contains enchanted books', () => {
    expect(hasEnchantedBookLoot()).toBe(true);
  });

  it('shelf radius positive', () => {
    expect(bookshelfAreaRadius()).toBeGreaterThan(0);
  });
});
