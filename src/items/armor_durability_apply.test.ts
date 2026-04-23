import { describe, it, expect } from 'vitest';
import { cost, applyDamage, isNearBreaking } from './armor_durability_apply';

describe('armor durability apply', () => {
  it('min 1 cost', () => {
    expect(cost(0.5)).toBe(1);
  });

  it('cost scales', () => {
    expect(cost(16)).toBe(4);
  });

  it('apply reduces durability', () => {
    const p = applyDamage({ id: 'iron_chestplate', durability: 100, maxDurability: 240 }, 8);
    expect(p?.durability).toBe(98);
  });

  it('destroyed on 0', () => {
    expect(applyDamage({ id: 'x', durability: 1, maxDurability: 100 }, 100)).toBeNull();
  });

  it('near breaking ≤ 10%', () => {
    expect(isNearBreaking({ id: 'x', durability: 5, maxDurability: 100 })).toBe(true);
    expect(isNearBreaking({ id: 'x', durability: 50, maxDurability: 100 })).toBe(false);
  });
});
