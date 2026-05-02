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

  it('boost duration scales with flight (wiki: 0.5 + 0.5 × duration)', () => {
    // Wiki (minecraft.wiki/w/Firework_Rocket): rocket flies for
    // (10 + 10 × duration) ticks → 1 / 1.5 / 2 seconds at flight
    // 1 / 2 / 3. Old formula `flight × 1.5` gave 1.5 / 3 / 4.5 sec.
    const r1 = craftFireworkRocket({ paperCount: 1, gunpowderCount: 1, stars: [] });
    const r2 = craftFireworkRocket({ paperCount: 1, gunpowderCount: 2, stars: [] });
    const r3 = craftFireworkRocket({ paperCount: 1, gunpowderCount: 3, stars: [] });
    if (!r1 || !r2 || !r3) throw new Error();
    expect(boostDuration(r1)).toBe(1);
    expect(boostDuration(r2)).toBe(1.5);
    expect(boostDuration(r3)).toBe(2);
  });
});
