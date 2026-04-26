import { describe, it, expect } from 'vitest';
import { feed, tick, growFraction, GROW_TICKS_DEFAULT, type BabyState } from './baby_grow_speedup';

// tick mutates in place; build a fresh baby per test to keep them hermetic.
const newBaby = (): BabyState => ({ ageTicks: 0, isBaby: true });

describe('baby grow speedup', () => {
  it('feed ages baby', () => {
    expect(feed(newBaby()).ageTicks).toBeGreaterThan(0);
  });

  it('adult ignores food', () => {
    const adult: BabyState = { ageTicks: 0, isBaby: false };
    expect(feed(adult).ageTicks).toBe(0);
  });

  it('tick ages', () => {
    expect(tick(newBaby()).ageTicks).toBe(1);
  });

  it('matures at threshold', () => {
    const r = tick({ ageTicks: GROW_TICKS_DEFAULT - 1, isBaby: true });
    expect(r.isBaby).toBe(false);
  });

  it('adult stays', () => {
    const adult: BabyState = { ageTicks: 0, isBaby: false };
    expect(tick(adult)).toBe(adult);
  });

  it('growth fraction progresses', () => {
    expect(growFraction({ ageTicks: GROW_TICKS_DEFAULT / 2, isBaby: true })).toBeCloseTo(0.5);
  });

  it('adult fraction 1', () => {
    expect(growFraction({ ageTicks: 0, isBaby: false })).toBe(1);
  });
});
