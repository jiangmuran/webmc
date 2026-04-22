import { describe, it, expect } from 'vitest';
import { canPlace, randomTick, MAX_HEIGHT, MAX_AGE } from './sugar_cane_grow';

describe('sugar cane', () => {
  it('placement needs water + valid ground', () => {
    expect(canPlace({ groundBlockId: 'webmc:sand', waterAdjacentToGround: true })).toBe(true);
    expect(canPlace({ groundBlockId: 'webmc:sand', waterAdjacentToGround: false })).toBe(false);
    expect(canPlace({ groundBlockId: 'webmc:stone', waterAdjacentToGround: true })).toBe(false);
  });

  it('age increments', () => {
    const s = { age: 0 };
    expect(randomTick({ state: s, currentHeight: 1 })).toBe('age_inc');
    expect(s.age).toBe(1);
  });

  it('grows up at max age', () => {
    const s = { age: MAX_AGE };
    expect(randomTick({ state: s, currentHeight: 1 })).toBe('grow_up');
    expect(s.age).toBe(0);
  });

  it('no grow at max height', () => {
    const s = { age: MAX_AGE };
    expect(randomTick({ state: s, currentHeight: MAX_HEIGHT })).toBe('noop');
  });
});
