import { describe, it, expect } from 'vitest';
import { fitsInSpace, randomSizeFitting, SIZES } from './painting_sizes';

describe('painting sizes', () => {
  it('small always fits', () => {
    const first = SIZES[0];
    expect(first).toBeDefined();
    if (first) {
      expect(fitsInSpace(first, 4, 4)).toBe(true);
    }
  });

  it('big does not fit small space', () => {
    const big = SIZES.find((s) => s.id === 'pigscene');
    expect(big).toBeDefined();
    if (big) expect(fitsInSpace(big, 2, 2)).toBe(false);
  });

  it('random fitting chooses something', () => {
    expect(randomSizeFitting(4, 4, () => 0.5)).toBeDefined();
  });

  it('no fit = undefined', () => {
    expect(randomSizeFitting(0, 0, () => 0.5)).toBeUndefined();
  });
});
