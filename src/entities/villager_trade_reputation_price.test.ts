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
});
