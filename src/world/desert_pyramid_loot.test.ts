import { describe, it, expect } from 'vitest';
import {
  rollLoot,
  DESERT_PYRAMID_CHEST_COUNT,
  TRAP_TNT_COUNT,
  DESERT_LOOT_POOL,
} from './desert_pyramid_loot';

describe('desert pyramid loot', () => {
  it('4 chests', () => {
    expect(DESERT_PYRAMID_CHEST_COUNT).toBe(4);
  });

  it('9 tnt trap', () => {
    expect(TRAP_TNT_COUNT).toBe(9);
  });

  it('roll in pool', () => {
    const ids = new Set(DESERT_LOOT_POOL.map((e) => e.id));
    for (let i = 0; i < 100; i++) {
      expect(ids.has(rollLoot(Math.random))).toBe(true);
    }
  });

  it('lowest roll = diamond', () => {
    expect(rollLoot(() => 0)).toBe('diamond');
  });
});
