import { describe, it, expect } from 'vitest';
import { addPickle, boneMealPickle, lightEmission, makeSeaPickle } from './sea_pickle';

describe('sea pickle', () => {
  it('light emission scales 3/6/9/12 in water', () => {
    expect(lightEmission(makeSeaPickle(1))).toBe(3);
    expect(lightEmission(makeSeaPickle(4))).toBe(12);
  });

  it('no emission out of water', () => {
    expect(lightEmission(makeSeaPickle(4, false))).toBe(0);
  });

  it('addPickle caps at 4', () => {
    const p = makeSeaPickle(3);
    expect(addPickle(p)).toBe(true);
    expect(addPickle(p)).toBe(false);
  });

  it('bone meal on full pickle + coral spreads', () => {
    const r = boneMealPickle({
      state: makeSeaPickle(4),
      onCoralBlock: true,
      rng: () => 0.5,
    });
    expect(r.duplicates).toBeGreaterThan(0);
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
