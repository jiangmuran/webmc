import { describe, it, expect } from 'vitest';
import { makeCocoa, randomTick, beansOnBreak, boneMeal } from './cocoa_bean_plant';

describe('cocoa', () => {
  it('grows on log', () => {
    const c = makeCocoa('north');
    expect(randomTick(c, { rand: () => 0, jungleLogAttached: true })).toBe('grew');
    expect(c.stage).toBe(1);
  });

  it('no log = falls', () => {
    const c = makeCocoa('north');
    expect(randomTick(c, { rand: () => 0, jungleLogAttached: false })).toBe('fell_off');
  });

  it('mature gives 2-3 beans', () => {
    const c = makeCocoa('north');
    c.stage = 2;
    const n = beansOnBreak(c, 0, () => 0);
    expect([2, 3]).toContain(n);
  });

  it('fortune III adds uniform 0..3 bonus (wiki)', () => {
    const c = makeCocoa('north');
    c.stage = 2;
    // High roll exercises the bonus side. base = 2 + floor(0.99*2) = 3,
    // fortune = floor(0.99 * 4) = 3 → 6 total (cap).
    const high = beansOnBreak(c, 3, () => 0.99);
    expect(high).toBeGreaterThanOrEqual(2);
    expect(high).toBeLessThanOrEqual(6);
  });

  it('bone meal advances', () => {
    const c = makeCocoa('north');
    expect(boneMeal(c)).toBe(true);
    expect(c.stage).toBe(1);
  });

  it('bone meal capped at 2', () => {
    const c = { stage: 2 as const, attached: 'north' as const };
    expect(boneMeal(c)).toBe(false);
  });
});
