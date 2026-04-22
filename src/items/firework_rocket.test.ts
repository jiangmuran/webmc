import { describe, it, expect } from 'vitest';
import { boostDuration, craftFireworkRocket } from './firework_rocket';

describe('firework rocket', () => {
  it('crafts with paper + gunpowder', () => {
    const r = craftFireworkRocket({ paperCount: 1, gunpowderCount: 2, stars: [] });
    expect(r?.flightDuration).toBe(2);
  });

  it('refuses without paper', () => {
    expect(craftFireworkRocket({ paperCount: 0, gunpowderCount: 1, stars: [] })).toBeNull();
  });

  it('refuses more than 7 stars', () => {
    const stars = Array.from({ length: 8 }, () => ({
      shape: 'small' as const,
      colors: [[255, 0, 0]] as [number, number, number][],
      fadeColors: [],
      trail: false,
      twinkle: false,
    }));
    expect(craftFireworkRocket({ paperCount: 1, gunpowderCount: 1, stars })).toBeNull();
  });

  it('boost duration scales with flight', () => {
    const r = craftFireworkRocket({ paperCount: 1, gunpowderCount: 3, stars: [] });
    if (!r) throw new Error();
    expect(boostDuration(r)).toBe(4.5);
  });
});
