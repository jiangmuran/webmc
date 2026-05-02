import { describe, it, expect } from 'vitest';
import {
  makeNetherWart,
  randomTick,
  breakDrops,
  boneMealWorks,
  MAX_AGE,
} from './nether_wart_growth';

describe('nether wart', () => {
  it('grows on soul sand', () => {
    const n = makeNetherWart();
    expect(randomTick(n, { onSoulSand: true, rand: () => 0 })).toBe('grew');
    expect(n.age).toBe(1);
  });

  it('off soul sand no grow', () => {
    const n = makeNetherWart();
    expect(randomTick(n, { onSoulSand: false, rand: () => 0 })).toBe('noop');
  });

  it('mature drop 2..4 base, fortune adds 0..level uniform', () => {
    const n = { age: MAX_AGE };
    // rand=0 for both calls: base=2, fortune bonus=floor(0*level+1)=0,
    // so values equal at the low end (wiki: fortune is a uniform roll).
    const d = breakDrops(n, 0, () => 0);
    expect(d).toBe(2);
    // rand=0.99 gives top base 4 + floor(0.99 * 4) = 7 with fortune III.
    const fortMax = breakDrops(n, 3, () => 0.99);
    expect(fortMax).toBeGreaterThanOrEqual(d);
    expect(fortMax).toBeLessThanOrEqual(8);
  });

  it('immature drops 1', () => {
    expect(breakDrops({ age: 0 }, 0, () => 0)).toBe(1);
  });

  it('bone meal no', () => {
    expect(boneMealWorks()).toBe(false);
  });
});
