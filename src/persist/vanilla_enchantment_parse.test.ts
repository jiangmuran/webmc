import { describe, it, expect } from 'vitest';
import { parseVanillaEnchantment, EnchantmentParseError } from './vanilla_enchantment_parse';

describe('vanilla enchantment parser', () => {
  it('parses a typical Sharpness enchantment', () => {
    const e = parseVanillaEnchantment(
      JSON.stringify({
        description: 'Sharpness',
        anvil_cost: 4,
        max_level: 5,
        min_cost: { base: 1, per_level_above_first: 11 },
        max_cost: { base: 21, per_level_above_first: 11 },
        weight: 10,
        primary_items: '#minecraft:enchantable/sharp_weapon',
        supported_items: '#minecraft:enchantable/weapon',
        exclusive_set: '#minecraft:exclusive_set/damage',
        slots: ['mainhand'],
      }),
    );
    expect(e.description).toBe('Sharpness');
    expect(e.anvilCost).toBe(4);
    expect(e.maxLevel).toBe(5);
    expect(e.minCost).toEqual({ base: 1, perLevelAboveFirst: 11 });
    expect(e.maxCost).toEqual({ base: 21, perLevelAboveFirst: 11 });
    expect(e.weight).toBe(10);
    expect(e.primaryItems).toBe('#webmc:enchantable/sharp_weapon');
    expect(e.supportedItems).toBe('#webmc:enchantable/weapon');
    expect(e.exclusiveSet).toBe('#webmc:exclusive_set/damage');
    expect(e.slots).toEqual(['mainhand']);
  });

  it('flattens a text-component description', () => {
    const e = parseVanillaEnchantment(
      JSON.stringify({
        description: { translate: 'enchantment.minecraft.fortune' },
        max_level: 3,
        min_cost: { base: 1, per_level_above_first: 9 },
        max_cost: { base: 51, per_level_above_first: 9 },
      }),
    );
    expect(e.description).toBe('enchantment.minecraft.fortune');
  });

  it('handles direct (non-tag) item refs', () => {
    const e = parseVanillaEnchantment(
      JSON.stringify({
        description: 'Custom',
        max_level: 1,
        primary_items: 'minecraft:diamond_sword',
        supported_items: 'minecraft:diamond_sword',
        min_cost: { base: 1, per_level_above_first: 0 },
        max_cost: { base: 5, per_level_above_first: 0 },
      }),
    );
    expect(e.primaryItems).toBe('webmc:diamond_sword');
    expect(e.supportedItems).toBe('webmc:diamond_sword');
  });

  it('falls back gracefully when fields missing', () => {
    const e = parseVanillaEnchantment('{}');
    expect(e.description).toBe('');
    expect(e.anvilCost).toBe(1);
    expect(e.maxLevel).toBe(1);
    expect(e.minCost).toEqual({ base: 1, perLevelAboveFirst: 0 });
    expect(e.primaryItems).toBeNull();
    expect(e.exclusiveSet).toBeNull();
    expect(e.slots).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaEnchantment('not json')).toThrow(EnchantmentParseError);
  });
});
