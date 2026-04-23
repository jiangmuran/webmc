import { describe, it, expect } from 'vitest';
import { growthChance, tryAdvance, fullyGrown, MIN_LIGHT } from './crop_growth';

describe('crop growth', () => {
  it('too dark no growth', () => {
    expect(
      growthChance({
        age: 0,
        maxAge: 7,
        lightLevel: 4,
        farmlandHydrated: true,
        sameCropNeighbors: 0,
      }),
    ).toBe(0);
  });

  it('hydrated faster', () => {
    const dry = growthChance({
      age: 0,
      maxAge: 7,
      lightLevel: MIN_LIGHT,
      farmlandHydrated: false,
      sameCropNeighbors: 0,
    });
    const wet = growthChance({
      age: 0,
      maxAge: 7,
      lightLevel: MIN_LIGHT,
      farmlandHydrated: true,
      sameCropNeighbors: 0,
    });
    expect(wet).toBeGreaterThan(dry);
  });

  it('crowded slower', () => {
    const open = growthChance({
      age: 0,
      maxAge: 7,
      lightLevel: MIN_LIGHT,
      farmlandHydrated: true,
      sameCropNeighbors: 0,
    });
    const tight = growthChance({
      age: 0,
      maxAge: 7,
      lightLevel: MIN_LIGHT,
      farmlandHydrated: true,
      sameCropNeighbors: 4,
    });
    expect(tight).toBeLessThan(open);
  });

  it('tryAdvance increments', () => {
    const r = tryAdvance(
      { age: 0, maxAge: 7, lightLevel: 15, farmlandHydrated: true, sameCropNeighbors: 0 },
      () => 0,
    );
    expect(r.age).toBeGreaterThanOrEqual(0);
  });

  it('fullyGrown threshold', () => {
    expect(
      fullyGrown({
        age: 7,
        maxAge: 7,
        lightLevel: 0,
        farmlandHydrated: false,
        sameCropNeighbors: 0,
      }),
    ).toBe(true);
  });
});
