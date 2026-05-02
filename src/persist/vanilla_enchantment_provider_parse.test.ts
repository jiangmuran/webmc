import { describe, it, expect } from 'vitest';
import {
  parseVanillaEnchantmentProvider,
  EnchantmentProviderParseError,
} from './vanilla_enchantment_provider_parse';

describe('vanilla enchantment_provider parser', () => {
  it('parses a single-enchantment provider with level range', () => {
    const e = parseVanillaEnchantmentProvider(
      JSON.stringify({
        type: 'minecraft:single',
        enchantment: 'minecraft:sharpness',
        level: { min: 2, max: 5 },
      }),
    );
    expect(e.type).toBe('single');
    expect(e.enchantment).toBe('webmc:sharpness');
    expect(e.levelMin).toBe(2);
    expect(e.levelMax).toBe(5);
  });

  it('parses by_cost with #tag enchantment ref', () => {
    const e = parseVanillaEnchantmentProvider(
      JSON.stringify({
        type: 'minecraft:by_cost',
        enchantments: '#minecraft:in_enchanting_table',
        cost: { min: 1, max: 30 },
      }),
    );
    expect(e.type).toBe('by_cost');
    expect(e.enchantment).toBe('#webmc:in_enchanting_table');
    expect(e.levelMin).toBe(1);
    expect(e.levelMax).toBe(30);
  });

  it('parses by_cost_with_difficulty bracketed cost range', () => {
    const e = parseVanillaEnchantmentProvider(
      JSON.stringify({
        type: 'minecraft:by_cost_with_difficulty',
        enchantments: '#minecraft:on_random_loot',
        min_cost: { min: 5, max: 10 },
        max_cost: { min: 25, max: 35 },
      }),
    );
    expect(e.type).toBe('by_cost_with_difficulty');
    expect(e.levelMin).toBe(5);
    expect(e.levelMax).toBe(35);
  });

  it('marks unknown type', () => {
    const e = parseVanillaEnchantmentProvider(JSON.stringify({ type: 'mymod:custom' }));
    expect(e.type).toBe('unknown');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaEnchantmentProvider('nope')).toThrow(EnchantmentProviderParseError);
  });
});
