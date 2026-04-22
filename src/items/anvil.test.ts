import { describe, it, expect } from 'vitest';
import { anvilCombine, type AnvilResult } from './anvil';
import { applyEnchant, hasEnchant, type Enchanted } from './enchantment';

const damaged = (hp: number): Enchanted => ({ itemId: 5, count: 1, damage: hp });

function must(r: AnvilResult | null): AnvilResult {
  if (r === null) throw new Error('expected anvil result');
  return r;
}

describe('anvil', () => {
  it('repair: two damaged swords combine into less damaged one', () => {
    const r = must(anvilCombine({ left: damaged(100), right: damaged(40) }));
    expect(r.output.damage).toBeLessThan(100);
    expect(r.xpCost).toBeGreaterThan(0);
  });

  it('rename costs 1 xp', () => {
    const r = must(anvilCombine({ left: damaged(0), right: null, newName: 'Fang' }));
    expect(r.xpCost).toBe(1);
    expect(r.output.name).toBe('Fang');
  });

  it('merges enchants and increments when levels match', () => {
    const left = applyEnchant(damaged(0), 'sharpness', 2);
    const right = applyEnchant(damaged(0), 'sharpness', 2);
    const r = must(anvilCombine({ left, right }));
    expect(hasEnchant(r.output, 'sharpness')).toBe(3);
  });

  it('merges enchants takes higher level when mismatched', () => {
    const left = applyEnchant(damaged(0), 'sharpness', 4);
    const right = applyEnchant(damaged(0), 'sharpness', 2);
    const r = must(anvilCombine({ left, right }));
    expect(hasEnchant(r.output, 'sharpness')).toBe(4);
  });

  it('rejects combining different item types', () => {
    const left: Enchanted = { itemId: 1, count: 1, damage: 0 };
    const right: Enchanted = { itemId: 2, count: 1, damage: 0 };
    const r = anvilCombine({ left, right });
    expect(r).toBeNull();
  });
});
