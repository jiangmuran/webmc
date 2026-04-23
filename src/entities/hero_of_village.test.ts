import { describe, it, expect } from 'vitest';
import {
  tradePriceMultiplier,
  villagerGiftChance,
  hasEffect,
  HERO_DURATION_TICKS,
} from './hero_of_village';

describe('hero of village', () => {
  it('lower price with level', () => {
    expect(tradePriceMultiplier(5)).toBeLessThan(tradePriceMultiplier(0));
  });

  it('price floor', () => {
    expect(tradePriceMultiplier(1000)).toBeGreaterThanOrEqual(0.3);
  });

  it('gift chance grows', () => {
    expect(villagerGiftChance(5)).toBeGreaterThan(villagerGiftChance(0));
  });

  it('duration > 0', () => {
    expect(HERO_DURATION_TICKS).toBeGreaterThan(0);
  });

  it('hasEffect threshold', () => {
    expect(hasEffect(0)).toBe(false);
    expect(hasEffect(1)).toBe(true);
  });
});
