import { describe, it, expect } from 'vitest';
import { combineBooks, xpCost, type BookEnchant } from './enchant_book_combine';

describe('enchant book combine', () => {
  it('same level merges +1', () => {
    const a: BookEnchant[] = [{ id: 'sharpness', level: 2, maxLevel: 5 }];
    const b: BookEnchant[] = [{ id: 'sharpness', level: 2, maxLevel: 5 }];
    expect(combineBooks(a, b)[0]?.level).toBe(3);
  });

  it('higher level wins', () => {
    const a: BookEnchant[] = [{ id: 'sharpness', level: 2, maxLevel: 5 }];
    const b: BookEnchant[] = [{ id: 'sharpness', level: 4, maxLevel: 5 }];
    expect(combineBooks(a, b)[0]?.level).toBe(4);
  });

  it('different enchants combined', () => {
    const a: BookEnchant[] = [{ id: 'sharpness', level: 1, maxLevel: 5 }];
    const b: BookEnchant[] = [{ id: 'fire_aspect', level: 1, maxLevel: 2 }];
    expect(combineBooks(a, b)).toHaveLength(2);
  });

  it('caps at max', () => {
    const a: BookEnchant[] = [{ id: 'sharpness', level: 5, maxLevel: 5 }];
    const b: BookEnchant[] = [{ id: 'sharpness', level: 5, maxLevel: 5 }];
    expect(combineBooks(a, b)[0]?.level).toBe(5);
  });

  it('xp cost rises with levels', () => {
    const a: BookEnchant[] = [{ id: 'sharpness', level: 1, maxLevel: 5 }];
    const b: BookEnchant[] = [{ id: 'sharpness', level: 3, maxLevel: 5 }];
    expect(xpCost(a, b)).toBeGreaterThan(0);
  });
});
