import { describe, it, expect } from 'vitest';
import { hasShip, elytraInShip, shulkersInCity, SHIP_CHANCE } from './end_city_ship_chance';

describe('end city ship chance', () => {
  it('coin flip for ship', () => {
    expect(hasShip(() => 0)).toBe(true);
    expect(hasShip(() => 0.99)).toBe(false);
  });

  it('ship always has elytra', () => {
    expect(elytraInShip(() => 0.5)).toBe(true);
  });

  it('shulkers > 0', () => {
    expect(shulkersInCity()).toBeGreaterThan(0);
  });

  it('chance half', () => {
    expect(SHIP_CHANCE).toBeCloseTo(0.5);
  });
});
