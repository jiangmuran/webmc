import { describe, it, expect } from 'vitest';
import { rollLoot, type LootTable } from './loot_table';

const table: LootTable = {
  id: 'test_table',
  pools: [
    {
      rolls: 1,
      entries: [
        { itemId: 1, minCount: 1, maxCount: 3, weight: 50 },
        { itemId: 2, minCount: 1, maxCount: 1, weight: 1 },
        { itemId: 3, minCount: 1, maxCount: 1, weight: 1, condition: { fortuneMin: 2 } },
      ],
    },
  ],
};

describe('loot table', () => {
  it('rolls at least one item per pool', () => {
    const out = rollLoot(table, {
      fortune: 0,
      silkTouch: false,
      killerType: null,
      luck: 0,
      rng: () => 0.01,
    });
    expect(out.length).toBeGreaterThanOrEqual(1);
  });

  it('fortune gates conditional entries', () => {
    let sawConditional = false;
    for (let i = 0; i < 1000; i++) {
      const out = rollLoot(table, {
        fortune: 3,
        silkTouch: false,
        killerType: null,
        luck: 0,
        rng: Math.random,
      });
      if (out.some((s) => s.itemId === 3)) sawConditional = true;
    }
    expect(sawConditional).toBe(true);
  });

  it('fortune 0 excludes conditional entries', () => {
    for (let i = 0; i < 500; i++) {
      const out = rollLoot(table, {
        fortune: 0,
        silkTouch: false,
        killerType: null,
        luck: 0,
        rng: Math.random,
      });
      expect(out.some((s) => s.itemId === 3)).toBe(false);
    }
  });

  it('luck adds bonus rolls when configured', () => {
    const luckyTable: LootTable = {
      id: 'luck',
      pools: [
        {
          rolls: 1,
          bonusRollsPerLuck: 1,
          entries: [{ itemId: 1, minCount: 1, maxCount: 1, weight: 1 }],
        },
      ],
    };
    const noLuck = rollLoot(luckyTable, {
      fortune: 0,
      silkTouch: false,
      killerType: null,
      luck: 0,
      rng: () => 0.5,
    });
    const lucky = rollLoot(luckyTable, {
      fortune: 0,
      silkTouch: false,
      killerType: null,
      luck: 3,
      rng: () => 0.5,
    });
    expect(lucky.length).toBeGreaterThan(noLuck.length);
  });

  it('silk touch condition honored', () => {
    const silkTable: LootTable = {
      id: 'silk',
      pools: [
        {
          rolls: 1,
          entries: [
            {
              itemId: 99,
              minCount: 1,
              maxCount: 1,
              weight: 1,
              condition: { requiresSilkTouch: true },
            },
          ],
        },
      ],
    };
    const withSilk = rollLoot(silkTable, {
      fortune: 0,
      silkTouch: true,
      killerType: null,
      luck: 0,
      rng: () => 0.5,
    });
    const without = rollLoot(silkTable, {
      fortune: 0,
      silkTouch: false,
      killerType: null,
      luck: 0,
      rng: () => 0.5,
    });
    expect(withSilk.length).toBeGreaterThan(0);
    expect(without.length).toBe(0);
  });
});
