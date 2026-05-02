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

  it('mature drops exactly 3 beans (wiki)', () => {
    const c = makeCocoa('north');
    c.stage = 2;
    expect(beansOnBreak(c, 0, () => 0)).toBe(3);
    expect(beansOnBreak(c, 0, () => 0.99)).toBe(3);
  });

  it('Fortune does not increase yield (wiki)', () => {
    const c = makeCocoa('north');
    c.stage = 2;
    expect(beansOnBreak(c, 3, () => 0)).toBe(3);
    expect(beansOnBreak(c, 3, () => 0.99)).toBe(3);
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
