import { describe, it, expect } from 'vitest';
import {
  breakDrops,
  enchantPowerBoost,
  BOOKSHELF_BREAK_DROPS_BOOKS,
} from './bookshelf_place_break';

describe('bookshelf place break', () => {
  it('silk keeps shelf', () => {
    expect(breakDrops(true)[0]?.item).toBe('bookshelf');
  });

  it('drops 3 books', () => {
    expect(breakDrops(false)[0]).toEqual({ item: 'book', count: BOOKSHELF_BREAK_DROPS_BOOKS });
  });

  it('boosts enchant power', () => {
    expect(enchantPowerBoost()).toBe(1);
  });
});
