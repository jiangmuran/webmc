import { describe, it, expect } from 'vitest';
import { averageWithRandom, isRegressiveToMean } from './horse_breed_inheritance';

describe('horse breed inheritance', () => {
  it('produces non-zero stats', () => {
    const c = averageWithRandom(
      { maxHealth: 20, jumpStrength: 0.7, speed: 0.2 },
      { maxHealth: 18, jumpStrength: 0.6, speed: 0.15 },
      () => 0.5,
    );
    expect(c.maxHealth).toBeGreaterThan(0);
    expect(c.speed).toBeGreaterThan(0);
  });

  it('average roughly midpoint', () => {
    const c = averageWithRandom(
      { maxHealth: 20, jumpStrength: 0.5, speed: 0.25 },
      { maxHealth: 20, jumpStrength: 0.5, speed: 0.25 },
      () => 0.5,
    );
    expect(c.maxHealth).toBeCloseTo((20 + 20 + 15) / 3, 1);
  });

  it('regress-to-mean detection', () => {
    expect(isRegressiveToMean(10, 5, 0)).toBe(true);
    expect(isRegressiveToMean(10, 15, 0)).toBe(false);
  });
});
