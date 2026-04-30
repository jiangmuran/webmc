import { describe, it, expect } from 'vitest';
import {
  priceForReputation,
  demandAdjust,
  herovillageDiscount,
} from './villager_trade_reputation_price';

describe('villager trade reputation price', () => {
  it('positive reputation → cheaper', () => {
    expect(priceForReputation(10, 5)).toBeLessThan(10);
  });

  it('negative reputation → pricier', () => {
    expect(priceForReputation(10, -5)).toBeGreaterThan(10);
  });

  it('min price 1', () => {
    expect(priceForReputation(10, 100)).toBeGreaterThanOrEqual(1);
  });

  it('demand increases price', () => {
    expect(demandAdjust(10, 5)).toBeGreaterThan(10);
  });

  it('no demand → no change', () => {
    expect(demandAdjust(10, 0)).toBe(10);
  });

  it('hero discount', () => {
    expect(herovillageDiscount(10, 5)).toBeLessThan(10);
  });

  it('higher hero level → more discount', () => {
    const low = herovillageDiscount(10, 1);
    const high = herovillageDiscount(10, 5);
    expect(high).toBeLessThanOrEqual(low);
  });

  it('wiki canon: I=30%, II=36.25%, III=42.5%, IV=48.75%, V=55%', () => {
    // Final = base − floor(base × discountPct), per the wiki rounding
    // rule (discount is floored, not the final price).
    expect(herovillageDiscount(100, 1)).toBe(70); // 100 − floor(30)   = 70
    expect(herovillageDiscount(100, 2)).toBe(64); // 100 − floor(36.25) = 64
    expect(herovillageDiscount(100, 3)).toBe(58); // 100 − floor(42.5)  = 58
    expect(herovillageDiscount(100, 4)).toBe(52); // 100 − floor(48.75) = 52
    expect(herovillageDiscount(100, 5)).toBe(45); // 100 − floor(55)   = 45
  });

  it('wiki example: 14 emeralds, Level III → 9 emeralds (5-emerald discount)', () => {
    // Wiki: "For trade with 14 emeralds as the cost, the discount
    // would be 5 emeralds (rounded down from 5.95 emeralds), for a
    // final price of 9 emeralds."
    expect(herovillageDiscount(14, 3)).toBe(9);
  });
});
