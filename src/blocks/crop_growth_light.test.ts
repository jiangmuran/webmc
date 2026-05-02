import { describe, it, expect } from 'vitest';
import {
  tickCrop,
  growthChance,
  boneMealStages,
  canProduceFruit,
  MAX_AGE,
} from './crop_growth_light';

describe('crop', () => {
  it('moist > dry', () => {
    expect(growthChance(true)).toBeGreaterThan(growthChance(false));
  });

  it('low light blocks', () => {
    expect(
      tickCrop({ lightAbove: 5, farmlandMoist: true, age: 0, rand: () => 0, boneMealed: false }),
    ).toBe(false);
  });

  it('bone meal bypasses light', () => {
    expect(
      tickCrop({ lightAbove: 0, farmlandMoist: false, age: 0, rand: () => 0, boneMealed: true }),
    ).toBe(true);
  });

  it('max age no growth', () => {
    expect(
      tickCrop({
        lightAbove: 15,
        farmlandMoist: true,
        age: MAX_AGE,
        rand: () => 0,
        boneMealed: true,
      }),
    ).toBe(false);
  });

  it('beetroot bone meal: 0 or 1 with 75% chance of +1 (wiki)', () => {
    // Wiki minecraft.wiki/w/Beetroot: "Bone meal has a 75% chance to
    // advance growth by one stage." Outcome is 0 or 1, not 1-3.
    expect(boneMealStages('beetroot', () => 0.1)).toBe(1); // below 0.75 → +1
    expect(boneMealStages('beetroot', () => 0.9)).toBe(0); // above 0.75 → no-op
  });

  it('non-beetroot bone meal: 2-5 stages per wiki', () => {
    for (let i = 0; i < 20; i++) {
      const n = boneMealStages('wheat', () => i / 20);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(5);
    }
  });

  it('melon fruit gated by stem + space', () => {
    expect(canProduceFruit(false, MAX_AGE)).toBe(false);
    expect(canProduceFruit(true, MAX_AGE - 1)).toBe(false);
    expect(canProduceFruit(true, MAX_AGE)).toBe(true);
  });
});
