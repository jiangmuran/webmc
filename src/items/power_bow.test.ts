import { describe, it, expect } from 'vitest';
import { damageMultiplier, bonusDamage } from './power_bow';

describe('power bow', () => {
  it('base 1x at level 0', () => {
    expect(damageMultiplier(0)).toBe(1);
  });

  it('power 5 = 2.5x', () => {
    expect(damageMultiplier(5)).toBeCloseTo(2.5);
  });

  it('bonus from base', () => {
    expect(bonusDamage(4, 5)).toBeCloseTo(6);
  });

  it('caps', () => {
    expect(damageMultiplier(10)).toBe(damageMultiplier(5));
  });
});
