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

  it('explosion damage falls off', () => {
    const r = { flightDuration: 1 as const, stars: [] };
    expect(explosionDamage(r, 0)).toBe(5);
    expect(explosionDamage(r, 10)).toBe(0);
    expect(explosionDamage(r, 2.5)).toBe(2);
  });
});
