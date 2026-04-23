import { describe, it, expect } from 'vitest';
import { fallDamageMultiplier, effectiveFallDamage, growthAccelForBaby } from './hay_bale_fall_damage';

describe('hay bale fall damage', () => {
  it('multiplier < 1', () => {
    expect(fallDamageMultiplier()).toBeLessThan(1);
  });

  it('reduces damage', () => {
    expect(effectiveFallDamage(10)).toBeLessThan(10);
  });

  it('never negative', () => {
    expect(effectiveFallDamage(-5)).toBe(0);
  });

  it('feeds baby fast', () => {
    expect(growthAccelForBaby()).toBeGreaterThan(0);
  });
});
