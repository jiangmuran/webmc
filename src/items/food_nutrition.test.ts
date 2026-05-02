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

  it('mutton + cooked_mutton present per wiki', () => {
    expect(foodOf('mutton')?.hunger).toBe(2);
    expect(foodOf('cooked_mutton')?.hunger).toBe(6);
    expect(foodOf('cooked_mutton')?.saturation).toBeCloseTo(9.6, 1);
  });

  it('always-edible foods include enchanted_golden_apple + chorus_fruit', () => {
    expect(canEatAtFull('enchanted_golden_apple')).toBe(true);
    expect(canEatAtFull('chorus_fruit')).toBe(true);
  });

  it('honey_bottle takes 40 ticks to drink (wiki: 2 sec)', () => {
    expect(foodOf('honey_bottle')?.eatTimeTicks).toBe(40);
  });

  it('dried_kelp takes 16 ticks per wiki', () => {
    // Wiki minecraft.wiki/w/Dried_Kelp: "eaten faster than other
    // food (~0.86 seconds = 16 ticks vs the standard 32)."
    expect(foodOf('dried_kelp')?.eatTimeTicks).toBe(16);
  });
});
