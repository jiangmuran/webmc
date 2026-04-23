import { describe, it, expect } from 'vitest';
import { levelCost } from './enchant_table_offer_cost';

describe('enchant table offer cost', () => {
  it('slot 0 min 1', () => {
    expect(levelCost({ bookshelfPower: 15, slot: 0, randomBase: 0 })).toBeGreaterThanOrEqual(1);
  });

  it('slot 2 more expensive', () => {
    expect(levelCost({ bookshelfPower: 15, slot: 2, randomBase: 0 })).toBeGreaterThan(
      levelCost({ bookshelfPower: 15, slot: 0, randomBase: 0 }),
    );
  });

  it('min per slot', () => {
    expect(levelCost({ bookshelfPower: 0, slot: 2, randomBase: 0 })).toBeGreaterThanOrEqual(3);
  });

  it('more shelves higher max', () => {
    expect(levelCost({ bookshelfPower: 15, slot: 2, randomBase: 10 })).toBeGreaterThan(
      levelCost({ bookshelfPower: 0, slot: 2, randomBase: 0 }),
    );
  });
});
