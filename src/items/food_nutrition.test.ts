import { describe, it, expect } from 'vitest';
import { foodOf, canEatAtFull } from './food_nutrition';

describe('food nutrition', () => {
  it('cooked beef is premium', () => {
    const f = foodOf('cooked_beef');
    expect(f?.hunger).toBe(8);
    expect(f?.saturation).toBeGreaterThan(10);
  });

  it('raw beef inferior', () => {
    expect(foodOf('beef')?.hunger).toBeLessThan(foodOf('cooked_beef')?.hunger ?? 0);
  });

  it('golden apple always edible', () => {
    expect(canEatAtFull('golden_apple')).toBe(true);
    expect(canEatAtFull('apple')).toBe(false);
  });

  it('unknown food undefined', () => {
    expect(foodOf('diamond')).toBeUndefined();
  });
});
