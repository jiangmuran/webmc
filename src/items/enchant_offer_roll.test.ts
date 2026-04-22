import { describe, it, expect } from 'vitest';
import { rollOffers, lapisCost, xpLevelsSpent } from './enchant_offer_roll';

describe('enchant offers', () => {
  it('returns 3 offers', () => {
    const r = rollOffers({ bookshelves: 15, rand: () => 0.5 });
    expect(r.length).toBe(3);
  });

  it('clamps to 1..30', () => {
    for (let seed = 0; seed < 50; seed++) {
      const offers = rollOffers({
        bookshelves: 15,
        rand: () => ((seed * 7919) % 1000) / 1000,
      });
      for (const o of offers) {
        expect(o.requiredLevel).toBeGreaterThanOrEqual(1);
        expect(o.requiredLevel).toBeLessThanOrEqual(30);
      }
    }
  });

  it('deterministic with same rand', () => {
    const rand = () => 0.5;
    const a = rollOffers({ bookshelves: 10, rand });
    const b = rollOffers({ bookshelves: 10, rand });
    expect(a).toEqual(b);
  });

  it('slot costs', () => {
    expect(lapisCost(0)).toBe(1);
    expect(lapisCost(2)).toBe(3);
    expect(xpLevelsSpent(1)).toBe(2);
  });

  it('bookshelves clamped', () => {
    const r = rollOffers({ bookshelves: 100, rand: () => 0 });
    const r2 = rollOffers({ bookshelves: 15, rand: () => 0 });
    expect(r).toEqual(r2);
  });
});
