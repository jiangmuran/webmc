import { describe, it, expect } from 'vitest';
import { rollLevel, xpLevelsRequired, lapisCost, canAfford } from './enchant_table_offer';

describe('enchant table offer', () => {
  it('slot 2 can reach 30', () => {
    let max = 0;
    for (let i = 0; i < 200; i++) {
      const l = rollLevel({ slot: 2, bookshelves: 15, rand: Math.random });
      if (l > max) max = l;
    }
    expect(max).toBeGreaterThan(20);
  });

  it('slot 0 stays low', () => {
    for (let i = 0; i < 50; i++) {
      const l = rollLevel({ slot: 0, bookshelves: 0, rand: Math.random });
      expect(l).toBeLessThanOrEqual(10);
    }
  });

  it('cost by slot', () => {
    expect(xpLevelsRequired(0)).toBe(1);
    expect(xpLevelsRequired(2)).toBe(3);
    expect(lapisCost(0)).toBe(1);
    expect(lapisCost(2)).toBe(3);
  });

  it('afford check', () => {
    expect(canAfford(3, 3, 2)).toBe(true);
    expect(canAfford(2, 3, 2)).toBe(false);
  });
});
