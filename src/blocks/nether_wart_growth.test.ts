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

  it('mature drop 2..4+fortune', () => {
    const n = { age: MAX_AGE };
    const d = breakDrops(n, 0, () => 0);
    expect(d).toBeGreaterThanOrEqual(2);
    const fort = breakDrops(n, 3, () => 0);
    expect(fort).toBeGreaterThan(d);
  });

  it('immature drops 1', () => {
    expect(breakDrops({ age: 0 }, 0, () => 0)).toBe(1);
  });

  it('bone meal no', () => {
    expect(boneMealWorks()).toBe(false);
  });
});
