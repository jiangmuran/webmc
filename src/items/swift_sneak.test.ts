import { describe, it, expect } from 'vitest';
import { sneakSpeedMultiplier, sneakSpeed, onLeggings, treasureOnly } from './swift_sneak';

describe('swift sneak', () => {
  it('level 0 no multiplier', () => {
    expect(sneakSpeedMultiplier(0)).toBe(1);
  });

  it('level 3 = 1.45', () => {
    expect(sneakSpeedMultiplier(3)).toBeCloseTo(1.45);
  });

  it('speed multiplies', () => {
    expect(sneakSpeed(0.3, 2)).toBeCloseTo(0.3 * 1.3);
  });

  it('leggings slot', () => {
    expect(onLeggings()).toBe(true);
  });

  it('treasure only', () => {
    expect(treasureOnly()).toBe(true);
  });
});
