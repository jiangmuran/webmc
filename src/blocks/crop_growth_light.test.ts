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

  it('beetroot bone meal small stages', () => {
    for (let i = 0; i < 20; i++) {
      const n = boneMealStages('beetroot', () => i / 20);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(3);
    }
  });

  it('melon fruit gated by stem + space', () => {
    expect(canProduceFruit(false, MAX_AGE)).toBe(false);
    expect(canProduceFruit(true, MAX_AGE - 1)).toBe(false);
    expect(canProduceFruit(true, MAX_AGE)).toBe(true);
  });
});
