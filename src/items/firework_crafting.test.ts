import { describe, it, expect } from 'vitest';
import {
  craftRocket,
  flightTimeTicks,
  explosionDamage,
  type FireworkStar,
} from './firework_crafting';

describe('firework craft', () => {
  it('1-3 gunpowder', () => {
    expect(craftRocket({ gunpowder: 2, stars: [] })?.flightDuration).toBe(2);
    expect(craftRocket({ gunpowder: 0, stars: [] })).toBeNull();
    expect(craftRocket({ gunpowder: 4, stars: [] })).toBeNull();
  });

  it('max 7 stars', () => {
    const stars: FireworkStar[] = Array.from({ length: 8 }, () => ({
      shape: 'small_ball' as const,
      colors: ['red'],
      fadeColors: [],
      trail: false,
      twinkle: false,
    }));
    expect(craftRocket({ gunpowder: 1, stars })).toBeNull();
  });

  it('flight time scales', () => {
    const r = craftRocket({ gunpowder: 3, stars: [] });
    if (!r) throw new Error('expected rocket');
    expect(flightTimeTicks(r)).toBe(40);
  });

  it('starless rocket does 0 damage (wiki)', () => {
    const r = { flightDuration: 1 as const, stars: [] };
    expect(explosionDamage(r, 0)).toBe(0);
    expect(explosionDamage(r, 10)).toBe(0);
  });

  it('1-star rocket does 7 damage at center, falls off', () => {
    const star = {
      shape: 'small_ball' as const,
      colors: ['red'],
      fadeColors: [],
      trail: false,
      twinkle: false,
    };
    const r = { flightDuration: 1 as const, stars: [star] };
    expect(explosionDamage(r, 0)).toBe(7);
    expect(explosionDamage(r, 10)).toBe(0);
    // Halfway: 7 * 0.5 = 3.5 → floor = 3.
    expect(explosionDamage(r, 2.5)).toBe(3);
  });
});
