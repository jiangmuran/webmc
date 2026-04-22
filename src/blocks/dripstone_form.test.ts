import { describe, it, expect } from 'vitest';
import { makeDripstone, makeGrowthState, tickGrowth } from './dripstone_form';

describe('dripstone formation', () => {
  it('grows over time with water drip', () => {
    const f = makeDripstone('down');
    const g = makeGrowthState();
    let grown = false;
    for (let i = 0; i < 100; i++) {
      if (tickGrowth(f, g, { waterDripping: true, dtSec: 10, rng: () => 0.1 })) grown = true;
    }
    expect(grown).toBe(true);
    expect(f.height).toBeGreaterThan(1);
  });

  it('stops at max height', () => {
    const f = makeDripstone('up');
    f.height = 11;
    const g = makeGrowthState();
    expect(tickGrowth(f, g, { waterDripping: true, dtSec: 1000, rng: () => 0 })).toBe(false);
  });

  it('no water → no growth', () => {
    const f = makeDripstone('down');
    const g = makeGrowthState();
    expect(tickGrowth(f, g, { waterDripping: false, dtSec: 1000, rng: () => 0 })).toBe(false);
  });
});
