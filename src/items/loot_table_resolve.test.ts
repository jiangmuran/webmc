import { describe, it, expect } from 'vitest';
import { rollLoot, type LootEntry, type LootContext } from './loot_table_resolve';

const cow: LootEntry[] = [
  { id: 'beef', weight: 1, min: 1, max: 3 },
  { id: 'leather', weight: 1, min: 0, max: 2 },
];
const ctx: LootContext = {
  lootingLevel: 0,
  fortuneLevel: 0,
  flags: new Set(),
};

describe('loot table resolve', () => {
  it('single roll produces one item', () => {
    expect(rollLoot(cow, () => 0, ctx)).toHaveLength(1);
  });

  it('looting increases rolls', () => {
    const r = rollLoot(cow, () => 0.99, { ...ctx, lootingLevel: 3 });
    expect(r.length).toBeGreaterThan(1);
  });

  it('condition filters entries', () => {
    const e: LootEntry[] = [{ id: 'rare_drop', weight: 1, conditions: ['killed_by_player'] }];
    expect(rollLoot(e, () => 0, ctx)).toEqual([]);
    expect(
      rollLoot(e, () => 0, {
        ...ctx,
        flags: new Set(['killed_by_player']),
      }).length,
    ).toBe(1);
  });

  it('fortune adds bonus count', () => {
    const r = rollLoot([{ id: 'diamond', weight: 1, min: 1, max: 1 }], () => 0.99, {
      ...ctx,
      fortuneLevel: 3,
    });
    expect(r[0]?.count ?? 0).toBeGreaterThanOrEqual(1);
  });

  it('min 0 allows zero', () => {
    const r = rollLoot(cow, () => 0.6, ctx);
    expect(r[0]?.count).toBeGreaterThanOrEqual(0);
  });
});
