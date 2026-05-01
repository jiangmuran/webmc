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

  it('discount per wiki: 30% base + 6.25% per level (cap 55% at Hero V)', () => {
    // Wiki (minecraft.wiki/w/Hero_of_the_Village): "30% + each
    // additional level decreases by 1/16 (6.25%) for a total of 55%
    // at Hero V (amplifier 4)."
    expect(tradePriceMultiplier(0)).toBeCloseTo(0.7, 5); // 30% off
    expect(tradePriceMultiplier(2)).toBeCloseTo(0.575, 5); // 42.5% off
    expect(tradePriceMultiplier(4)).toBeCloseTo(0.45, 5); // 55% off
  });

  it('price floor at 0.45 (wiki cap)', () => {
    expect(tradePriceMultiplier(1000)).toBeGreaterThanOrEqual(0.45);
  });

  it('gift chance grows', () => {
    expect(villagerGiftChance(5)).toBeGreaterThan(villagerGiftChance(0));
  });

  it('duration is 40 minutes (wiki)', () => {
    // Wiki: "lasts 40 minutes" → 40 × 60 × 20 = 48,000 ticks.
    expect(HERO_DURATION_TICKS).toBe(48000);
  });

  it('hasEffect threshold', () => {
    expect(hasEffect(0)).toBe(false);
    expect(hasEffect(1)).toBe(true);
  });
});
