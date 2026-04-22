import { describe, it, expect } from 'vitest';
import { knockbackStrength, totalKnockback, PUNCH_MAX } from './punch_bow';

describe('punch bow', () => {
  it('level 0 no extra', () => {
    expect(knockbackStrength(0)).toBe(0);
  });

  it('level 2 max', () => {
    expect(knockbackStrength(2)).toBe(2);
  });

  it('caps at max', () => {
    expect(knockbackStrength(10)).toBe(PUNCH_MAX);
  });

  it('adds to base', () => {
    expect(totalKnockback(0.6, 2)).toBeCloseTo(2.6);
  });
});
