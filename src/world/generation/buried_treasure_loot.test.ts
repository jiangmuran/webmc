import { describe, it, expect } from 'vitest';
import { rollLoot } from './buried_treasure_loot';

describe('buried treasure loot', () => {
  it('always has heart of the sea', () => {
    const c = rollLoot(() => 0.5, 5);
    expect(c.items.some((i) => i.id === 'heart_of_the_sea')).toBe(true);
  });

  it('rolls right number', () => {
    expect(rollLoot(() => 0.5, 8).items.length).toBeGreaterThanOrEqual(1 + 1);
  });
});
