import { describe, it, expect } from 'vitest';
import { awardHero, makeHero, tickHero, tradeDiscount } from './hero_of_village';

describe('hero of the village', () => {
  it('fresh state gives 0 discount', () => {
    expect(tradeDiscount(makeHero())).toBe(0);
  });

  it('amplifier 0 → 30%, amplifier 4 → capped 55%', () => {
    const a = makeHero();
    awardHero(a, 0);
    expect(tradeDiscount(a)).toBe(0.3);
    const b = makeHero();
    awardHero(b, 4);
    expect(tradeDiscount(b)).toBeCloseTo(0.5, 3);
  });

  it('expires after 40 minutes', () => {
    const s = makeHero();
    awardHero(s, 1);
    tickHero(s, 40 * 60);
    expect(s.active).toBe(false);
  });

  it('ticking does nothing when inactive', () => {
    const s = makeHero();
    tickHero(s, 10);
    expect(s.active).toBe(false);
  });
});
