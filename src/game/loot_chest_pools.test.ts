import { describe, it, expect } from 'vitest';
import { rollCount, hasEnchantedBook } from './loot_chest_pools';

describe('loot chest pools', () => {
  it('dungeon 3-8 items', () => {
    const low = rollCount('simple_dungeon', () => 0);
    const high = rollCount('simple_dungeon', () => 0.99);
    expect(low).toBe(3);
    expect(high).toBe(8);
  });

  it('buried treasure always 1', () => {
    expect(rollCount('buried_treasure', () => 0.5)).toBe(1);
  });

  it('shipwreck generous', () => {
    expect(rollCount('shipwreck_treasure', () => 0.99)).toBe(10);
  });

  it('library has enchanted books', () => {
    expect(hasEnchantedBook('stronghold_library')).toBe(true);
  });

  it('dungeon no enchanted books', () => {
    expect(hasEnchantedBook('simple_dungeon')).toBe(false);
  });
});
