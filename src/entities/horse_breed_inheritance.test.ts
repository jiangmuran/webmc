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

  it('average uses wiki random ranges (rng=0.5 → midpoints)', () => {
    // Wiki minecraft.wiki/w/Horse#Breeding: R is uniform in
    //   Health 15..30, Jump 0.4..1.0, Speed 0.1125..0.3375.
    // With rng=0.5 the midpoints are 22.5 / 0.7 / 0.225.
    const c = averageWithRandom(
      { maxHealth: 20, jumpStrength: 0.5, speed: 0.25 },
      { maxHealth: 20, jumpStrength: 0.5, speed: 0.25 },
      () => 0.5,
    );
    expect(c.maxHealth).toBeCloseTo((20 + 20 + 22.5) / 3, 1);
    expect(c.jumpStrength).toBeCloseTo((0.5 + 0.5 + 0.7) / 3, 3);
    expect(c.speed).toBeCloseTo((0.25 + 0.25 + 0.225) / 3, 3);
  });

  it('rng=0 gives wiki minimum random; rng=1 gives wiki maximum', () => {
    const lo = averageWithRandom(
      { maxHealth: 0, jumpStrength: 0, speed: 0 },
      { maxHealth: 0, jumpStrength: 0, speed: 0 },
      () => 0,
    );
    const hi = averageWithRandom(
      { maxHealth: 0, jumpStrength: 0, speed: 0 },
      { maxHealth: 0, jumpStrength: 0, speed: 0 },
      () => 1,
    );
    // Health: 15..30 → /3 → 5..10
    expect(lo.maxHealth).toBeCloseTo(15 / 3);
    expect(hi.maxHealth).toBeCloseTo(30 / 3);
    // Jump: 0.4..1.0 → /3 → 0.133..0.333
    expect(lo.jumpStrength).toBeCloseTo(0.4 / 3, 3);
    expect(hi.jumpStrength).toBeCloseTo(1.0 / 3, 3);
    // Speed: 0.1125..0.3375 → /3 → 0.0375..0.1125
    expect(lo.speed).toBeCloseTo(0.1125 / 3, 4);
    expect(hi.speed).toBeCloseTo(0.3375 / 3, 4);
  });

  it('regress-to-mean detection', () => {
    expect(isRegressiveToMean(10, 5, 0)).toBe(true);
    expect(isRegressiveToMean(10, 15, 0)).toBe(false);
  });
});
