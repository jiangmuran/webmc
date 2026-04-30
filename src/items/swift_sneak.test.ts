import { describe, it, expect } from 'vitest';
import { sneakSpeedMultiplier, sneakSpeed, onLeggings, treasureOnly } from './swift_sneak';

describe('swift sneak', () => {
  it('level 0 no multiplier', () => {
    expect(sneakSpeedMultiplier(0)).toBe(1);
  });

  it('Swift Sneak III → 75% walking speed (wiki)', () => {
    // Default sneak = 0.3 walking; +0.15/level × 3 = 0.75
    expect(sneakSpeed(0.3, 3)).toBeCloseTo(0.75);
  });

  it('Swift Sneak II → 60% walking speed (wiki)', () => {
    expect(sneakSpeed(0.3, 2)).toBeCloseTo(0.6);
  });

  it('Swift Sneak I → 45% walking speed (wiki)', () => {
    expect(sneakSpeed(0.3, 1)).toBeCloseTo(0.45);
  });

  it('leggings slot', () => {
    expect(onLeggings()).toBe(true);
  });

  it('treasure only', () => {
    expect(treasureOnly()).toBe(true);
  });
});
