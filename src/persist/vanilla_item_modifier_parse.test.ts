import { describe, it, expect } from 'vitest';
import { parseVanillaItemModifier, ItemModifierParseError } from './vanilla_item_modifier_parse';

describe('vanilla item_modifier parser', () => {
  it('parses a single function object', () => {
    const ms = parseVanillaItemModifier(
      JSON.stringify({ function: 'minecraft:set_count', count: 4 }),
    );
    expect(ms).toHaveLength(1);
    expect(ms[0]?.function).toBe('webmc:set_count');
    expect(ms[0]?.raw['count']).toBe(4);
  });

  it('parses an array of modifiers', () => {
    const ms = parseVanillaItemModifier(
      JSON.stringify([
        { function: 'minecraft:set_count', count: { min: 1, max: 3 } },
        { function: 'minecraft:enchant_with_levels', levels: 30 },
      ]),
    );
    expect(ms).toHaveLength(2);
    expect(ms[0]?.function).toBe('webmc:set_count');
    expect(ms[1]?.function).toBe('webmc:enchant_with_levels');
  });

  it('handles missing function field', () => {
    const ms = parseVanillaItemModifier('{}');
    expect(ms[0]?.function).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaItemModifier('nope')).toThrow(ItemModifierParseError);
  });
});
