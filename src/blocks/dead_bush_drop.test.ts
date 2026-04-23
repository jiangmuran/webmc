import { describe, it, expect } from 'vitest';
import { drops, placesOnSand } from './dead_bush_drop';

describe('dead bush drop', () => {
  it('shears gives bush', () => {
    expect(drops({ withShears: true, rng: () => 0 })[0]?.item).toBe('dead_bush');
  });

  it('hand lucky gives sticks', () => {
    const d = drops({ withShears: false, rng: () => 0 });
    expect(d[0]?.item).toBe('stick');
  });

  it('hand unlucky no drop', () => {
    expect(drops({ withShears: false, rng: () => 0.99 })).toEqual([]);
  });

  it('placeable on sand', () => {
    expect(placesOnSand('sand')).toBe(true);
    expect(placesOnSand('stone')).toBe(false);
  });
});
