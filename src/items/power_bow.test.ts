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

  it('bonus rounded up to nearest half-heart (wiki)', () => {
    // Wiki: bonus = ceil(0.25 * (level+1) * base). At base=5 Power IV:
    // raw = 5 * 0.25 * 5 = 6.25 → ceil = 7 (NOT 6.25 raw).
    expect(bonusDamage(5, 4)).toBe(7);
    // base=3 Power III: raw = 3 * 0.25 * 4 = 3.0 → 3 exactly.
    expect(bonusDamage(3, 3)).toBe(3);
  });
});
