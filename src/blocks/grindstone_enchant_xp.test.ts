import { describe, it, expect } from 'vitest';
import { xpReturnedOnDisenchant, repairFromStacking } from './grindstone_enchant_xp';

describe('grindstone enchant xp', () => {
  it('refunds half xp', () => {
    expect(xpReturnedOnDisenchant({ enchantmentXp: 20, maxDurability: 100, durability: 50 })).toBe(
      10,
    );
  });

  it('no xp → 0', () => {
    expect(xpReturnedOnDisenchant({ enchantmentXp: 0, maxDurability: 100, durability: 50 })).toBe(
      0,
    );
  });

  it('repair adds durability', () => {
    const r = repairFromStacking(
      { enchantmentXp: 0, maxDurability: 100, durability: 20 },
      { enchantmentXp: 0, maxDurability: 100, durability: 30 },
    );
    expect(r).toBeGreaterThan(30);
  });

  it('repair clamps to max', () => {
    const r = repairFromStacking(
      { enchantmentXp: 0, maxDurability: 100, durability: 80 },
      { enchantmentXp: 0, maxDurability: 100, durability: 80 },
    );
    expect(r).toBeLessThanOrEqual(100);
  });
});
