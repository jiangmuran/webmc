import { describe, it, expect } from 'vitest';
import { canSpawnIn, yInRange, variantIdFor, FOSSIL_VARIANT_COUNT } from './fossil_spawn';

describe('fossil spawn', () => {
  it('accepts swamp', () => {
    expect(canSpawnIn('swamp')).toBe(true);
  });

  it('rejects plains', () => {
    expect(canSpawnIn('plains')).toBe(false);
  });

  it('y range covers both wiki ranges (0..320 and -63..-8)', () => {
    // Above-ground range (Y 0..320)
    expect(yInRange(0)).toBe(true);
    expect(yInRange(50)).toBe(true);
    expect(yInRange(100)).toBe(true);
    expect(yInRange(320)).toBe(true);
    expect(yInRange(321)).toBe(false);
    // Underground range (-63 to -8)
    expect(yInRange(-8)).toBe(true);
    expect(yInRange(-30)).toBe(true);
    expect(yInRange(-63)).toBe(true);
    expect(yInRange(-64)).toBe(false);
    // Gap between the two ranges (-7 to -1)
    expect(yInRange(-7)).toBe(false);
    expect(yInRange(-1)).toBe(false);
  });

  it('variant deterministic', () => {
    expect(variantIdFor(1, 2, 3)).toBe(variantIdFor(1, 2, 3));
  });

  it('variant in count', () => {
    for (let i = 0; i < 50; i++) {
      const v = variantIdFor(i, 0, 0);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(FOSSIL_VARIANT_COUNT);
    }
  });
});
