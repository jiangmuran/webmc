import { describe, it, expect } from 'vitest';
import { offersFor, lapisCostForSlot, xpLevelsConsumed, MAX_BOOKSHELVES } from './xp_enchant_cost';

describe('xp enchant cost', () => {
  it('no bookshelves low levels', () => {
    const o = offersFor({ bookshelvesNearby: 0, rngSeed: 1 });
    expect(o[0]?.levelRequirement).toBeLessThanOrEqual(3);
  });

  it('max bookshelves high requirement', () => {
    const o = offersFor({ bookshelvesNearby: MAX_BOOKSHELVES, rngSeed: 1 });
    expect(o[2]?.levelRequirement).toBeGreaterThanOrEqual(25);
  });

  it('slot 0 cheapest', () => {
    expect(lapisCostForSlot(0)).toBe(1);
  });

  it('slot 2 costs 3 lapis', () => {
    expect(lapisCostForSlot(2)).toBe(3);
  });

  it('xp cost scales with slot', () => {
    expect(xpLevelsConsumed(0)).toBe(1);
    expect(xpLevelsConsumed(2)).toBe(3);
  });

  it('bookshelf cap honored', () => {
    const bigger = offersFor({ bookshelvesNearby: 100, rngSeed: 1 });
    const cap = offersFor({ bookshelvesNearby: MAX_BOOKSHELVES, rngSeed: 1 });
    expect(bigger[2]?.levelRequirement).toBe(cap[2]?.levelRequirement);
  });
});
