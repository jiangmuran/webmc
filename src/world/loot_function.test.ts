import { describe, it, expect } from 'vitest';
import { apply, type LootStack } from './loot_function';

function mk(id = 'iron_ingot'): LootStack {
  return { id, count: 1, enchantments: [], nbt: {} };
}

describe('loot function', () => {
  it('set_count clamps within range', () => {
    const s = apply({ kind: 'set_count', min: 2, max: 5 }, mk(), () => 0.5);
    expect(s.count).toBeGreaterThanOrEqual(2);
    expect(s.count).toBeLessThanOrEqual(5);
  });

  it('looting enchant adds bonus', () => {
    const s = apply(
      { kind: 'looting_enchant', bonusMin: 1, bonusMax: 1, lootingLevel: 2 },
      { ...mk(), count: 3 },
      () => 0,
    );
    expect(s.count).toBe(5);
  });

  it('apply enchant appends', () => {
    const s = apply({ kind: 'apply_enchant', id: 'sharpness', level: 3 }, mk(), Math.random);
    expect(s.enchantments.length).toBe(1);
  });

  it('furnace smelt maps', () => {
    const s = apply(
      { kind: 'furnace_smelt', mapping: { raw_chicken: 'cooked_chicken' } },
      mk('raw_chicken'),
      Math.random,
    );
    expect(s.id).toBe('cooked_chicken');
  });

  it('furnace smelt no-op if unmapped', () => {
    const s = apply({ kind: 'furnace_smelt', mapping: {} }, mk('stone'), Math.random);
    expect(s.id).toBe('stone');
  });
});
