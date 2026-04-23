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
});
