import { describe, it, expect } from 'vitest';
import { rollGift, catSleptOnBed, canGift, CAT_GIFT_POOL } from './cat_morning_gift';

describe('cat morning gift', () => {
  it('lucky gift from pool', () => {
    const g = rollGift(() => 0);
    expect(CAT_GIFT_POOL).toContain(g);
  });

  it('high roll no gift', () => {
    expect(rollGift(() => 0.95)).toBeNull();
  });

  it('slept only if adjacent', () => {
    expect(catSleptOnBed(true, true)).toBe(true);
    expect(catSleptOnBed(true, false)).toBe(false);
    expect(catSleptOnBed(false, true)).toBe(false);
  });

  it('gifting needs tamed + sleep', () => {
    expect(canGift(true, true)).toBe(true);
    expect(canGift(false, true)).toBe(false);
    expect(canGift(true, false)).toBe(false);
  });

  it('phantom_membrane is rare (~3.22% vs ~16% for others, wiki)', () => {
    // Run many rolls with a deterministic-ish RNG; phantom membrane
    // should be roughly 1/5 as common as any other item.
    let phantomCount = 0;
    let chickenCount = 0;
    const N = 10_000;
    for (let i = 0; i < N; i++) {
      // First rand always passes the 0.7 gate; second rand picks the gift.
      let calls = 0;
      const r = (): number => (calls++ === 0 ? 0 : Math.random());
      const gift = rollGift(r);
      if (gift === 'phantom_membrane') phantomCount++;
      else if (gift === 'raw_chicken') chickenCount++;
    }
    // Phantom membrane should be ~3-4% of total, raw_chicken ~16%.
    // Allow generous tolerance for stochastic test.
    expect(phantomCount / N).toBeLessThan(0.06);
    expect(chickenCount / N).toBeGreaterThan(0.1);
    expect(chickenCount).toBeGreaterThan(phantomCount * 2);
  });
});
