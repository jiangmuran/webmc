import { describe, it, expect } from 'vitest';
import { rollLoot, FORTRESS_CHEST } from './nether_fortress_loot';

describe('nether fortress loot', () => {
  it('rolls a known id', () => {
    const r = rollLoot(FORTRESS_CHEST, () => 0.5);
    expect(r).toBeDefined();
    if (r) expect(FORTRESS_CHEST.items.some((i) => i.id === r.id)).toBe(true);
  });

  it('empty pool undefined', () => {
    expect(rollLoot({ items: [] }, () => 0.5)).toBeUndefined();
  });

  it('count within range', () => {
    const r = rollLoot(FORTRESS_CHEST, () => 0);
    if (r) expect(r.count).toBeGreaterThanOrEqual(1);
  });
});
