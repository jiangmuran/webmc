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

  it('fortune increases', () => {
    const c = makeCocoa('north');
    c.stage = 2;
    expect(beansOnBreak(c, 3, () => 0)).toBeGreaterThan(beansOnBreak(c, 0, () => 0));
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
