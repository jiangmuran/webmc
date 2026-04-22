import { describe, it, expect } from 'vitest';
import {
  makeBorder,
  setSize,
  effectiveSize,
  isOutside,
  damagePerSecondOutside,
} from './world_border_shrink';

describe('world border', () => {
  it('default huge', () => {
    const b = makeBorder(100);
    expect(effectiveSize(b, 0)).toBe(100);
  });

  it('inside no damage', () => {
    const b = makeBorder(100);
    expect(damagePerSecondOutside(b, 0, 0, 0)).toBe(0);
  });

  it('outside deals damage', () => {
    const b = makeBorder(10);
    expect(damagePerSecondOutside(b, 100, 0, 0)).toBeGreaterThan(0);
  });

  it('damage buffer shields', () => {
    const b = makeBorder(10);
    // outside size/2=5, inside buffer 5 from edge
    expect(damagePerSecondOutside(b, 8, 0, 0)).toBe(0);
  });

  it('interp shrink', () => {
    const b = makeBorder(100);
    setSize(b, 50, 1000, 0);
    expect(effectiveSize(b, 500)).toBeCloseTo(75);
    expect(effectiveSize(b, 1001)).toBeCloseTo(50);
  });

  it('isOutside honors interp', () => {
    const b = makeBorder(10);
    expect(isOutside(b, 6, 0, 0)).toBe(true);
    expect(isOutside(b, 4, 0, 0)).toBe(false);
  });
});
