import { describe, it, expect } from 'vitest';
import { maxAge, growthChance, randomTick, boneMealSteps } from './crop_growth_random_tick';

describe('crop random tick', () => {
  it('max age', () => {
    expect(maxAge('wheat')).toBe(7);
    expect(maxAge('beetroot')).toBe(3);
  });

  it('low light no growth', () => {
    expect(
      growthChance({
        crop: 'wheat',
        age: 0,
        lightAbove: 5,
        hydrated: true,
        inRowWithSameCrop: true,
        rand: () => 0,
      }),
    ).toBe(0);
  });

  it('hydration increases', () => {
    const hyd = growthChance({
      crop: 'wheat',
      age: 0,
      lightAbove: 15,
      hydrated: true,
      inRowWithSameCrop: false,
      rand: () => 0,
    });
    const dry = growthChance({
      crop: 'wheat',
      age: 0,
      lightAbove: 15,
      hydrated: false,
      inRowWithSameCrop: false,
      rand: () => 0,
    });
    expect(hyd).toBeGreaterThan(dry);
  });

  it('mature stays', () => {
    expect(
      randomTick({
        crop: 'wheat',
        age: 7,
        lightAbove: 15,
        hydrated: true,
        inRowWithSameCrop: true,
        rand: () => 0,
      }),
    ).toBe('stays');
  });

  it('nether wart ignores light', () => {
    expect(
      growthChance({
        crop: 'nether_wart',
        age: 0,
        lightAbove: 0,
        hydrated: false,
        inRowWithSameCrop: false,
        rand: () => 0,
      }),
    ).toBeGreaterThan(0);
  });

  it('bone meal steps', () => {
    expect(boneMealSteps('nether_wart', () => 0)).toBe(0);
    expect(boneMealSteps('wheat', () => 0.99)).toBeLessThanOrEqual(5);
  });
});
