import { describe, it, expect } from 'vitest';
import { rollPool, totalWeight, type LootPool } from './loot_table_weight_roll';

const pool: LootPool = {
  rolls: 2,
  entries: [
    { id: 'a', weight: 10, minCount: 1, maxCount: 3 },
    { id: 'b', weight: 30, minCount: 1, maxCount: 1 },
    { id: 'c', weight: 60, minCount: 2, maxCount: 4 },
  ],
};

describe('loot table weight roll', () => {
  it('total weight 100', () => {
    expect(totalWeight(pool)).toBe(100);
  });

  it('rolls N times', () => {
    expect(rollPool(pool, () => 0.5).length).toBe(2);
  });

  it('lowest roll picks first', () => {
    const r = rollPool({ rolls: 1, entries: pool.entries }, () => 0);
    expect(r[0]?.id).toBe('a');
  });

  it('high roll picks last', () => {
    const r = rollPool({ rolls: 1, entries: pool.entries }, () => 0.99);
    expect(r[0]?.id).toBe('c');
  });

  it('counts within range', () => {
    for (let i = 0; i < 50; i++) {
      const r = rollPool(pool, Math.random);
      for (const e of r) {
        expect(e.count).toBeGreaterThanOrEqual(1);
        expect(e.count).toBeLessThanOrEqual(4);
      }
    }
  });
});
