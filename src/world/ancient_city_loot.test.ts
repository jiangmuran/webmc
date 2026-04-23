import { describe, it, expect } from 'vitest';
import { pickLoot, ANCIENT_CITY_POOL } from './ancient_city_loot';

describe('ancient city loot', () => {
  it('returns id from pool', () => {
    const ids = new Set(ANCIENT_CITY_POOL.map((e) => e.id));
    for (let i = 0; i < 100; i++) {
      expect(ids.has(pickLoot(Math.random))).toBe(true);
    }
  });

  it('low roll = first', () => {
    expect(pickLoot(() => 0)).toBe('enchanted_golden_apple');
  });

  it('unique swift sneak', () => {
    expect(ANCIENT_CITY_POOL.some((e) => e.id === 'swift_sneak_book')).toBe(true);
  });
});
