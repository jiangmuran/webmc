import { describe, it, expect } from 'vitest';
import {
  discountApplied,
  discountMultiplier,
  DISCOUNT_MAJOR_POSITIVE,
} from './villager_cure_discount';

describe('villager cure discount', () => {
  it('witnesses grant discount', () => {
    expect(discountApplied({ witnessesNearby: 2, alreadyDiscountedOnce: false })).toBe(true);
    expect(discountApplied({ witnessesNearby: 0, alreadyDiscountedOnce: false })).toBe(false);
  });

  it('discount multiplier 1st cure', () => {
    expect(discountMultiplier(1)).toBeLessThan(1);
  });

  it('discount floor', () => {
    expect(discountMultiplier(100)).toBeGreaterThanOrEqual(0.25);
  });

  it('major positive amount', () => {
    expect(DISCOUNT_MAJOR_POSITIVE).toBe(20);
  });
});
