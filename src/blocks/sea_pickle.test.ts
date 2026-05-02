import { describe, it, expect } from 'vitest';
import { addPickle, boneMealPickle, lightEmission, makeSeaPickle } from './sea_pickle';

describe('sea pickle', () => {
  it('light emission scales 6/9/12/15 in water (wiki spec)', () => {
    expect(lightEmission(makeSeaPickle(1))).toBe(6);
    expect(lightEmission(makeSeaPickle(2))).toBe(9);
    expect(lightEmission(makeSeaPickle(3))).toBe(12);
    expect(lightEmission(makeSeaPickle(4))).toBe(15);
  });

  it('no emission out of water', () => {
    expect(lightEmission(makeSeaPickle(4, false))).toBe(0);
  });

  it('addPickle caps at 4', () => {
    const p = makeSeaPickle(3);
    expect(addPickle(p)).toBe(true);
    expect(addPickle(p)).toBe(false);
  });

  it('bone meal on full pickle + coral spreads 1-3 (wiki)', () => {
    // rng 0 → 1, rng 0.99 → 3
    expect(
      boneMealPickle({ state: makeSeaPickle(4), onCoralBlock: true, rng: () => 0 }).duplicates,
    ).toBe(1);
    expect(
      boneMealPickle({ state: makeSeaPickle(4), onCoralBlock: true, rng: () => 0.99 }).duplicates,
    ).toBe(3);
    // Range stays within 1-3 across many random rolls.
    for (let i = 0; i < 20; i++) {
      const r = boneMealPickle({ state: makeSeaPickle(4), onCoralBlock: true, rng: Math.random });
      expect(r.duplicates).toBeGreaterThanOrEqual(1);
      expect(r.duplicates).toBeLessThanOrEqual(3);
    }
  });

  it('bone meal without coral → no duplicates', () => {
    const r = boneMealPickle({
      state: makeSeaPickle(4),
      onCoralBlock: false,
      rng: () => 0.5,
    });
    expect(r.duplicates).toBe(0);
  });
});
