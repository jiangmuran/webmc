import { describe, it, expect } from 'vitest';
import {
  parseVanillaTrimPattern,
  parseVanillaTrimMaterial,
  TrimParseError,
} from './vanilla_trim_parse';

describe('vanilla armor trim parsers', () => {
  it('parses a trim_pattern', () => {
    const t = parseVanillaTrimPattern(
      JSON.stringify({
        asset_id: 'minecraft:sentry',
        description: { translate: 'trim_pattern.minecraft.sentry' },
        template_item: 'minecraft:sentry_armor_trim_smithing_template',
      }),
    );
    expect(t.assetId).toBe('webmc:sentry');
    expect(t.description).toBe('trim_pattern.minecraft.sentry');
    expect(t.templateItem).toBe('webmc:sentry_armor_trim_smithing_template');
  });

  it('parses a trim_material', () => {
    const t = parseVanillaTrimMaterial(
      JSON.stringify({
        asset_name: 'iron',
        description: 'Iron Material',
        ingredient: 'minecraft:iron_ingot',
        item_model_index: 0.1,
      }),
    );
    expect(t.assetName).toBe('iron');
    expect(t.description).toBe('Iron Material');
    expect(t.ingredient).toBe('webmc:iron_ingot');
    expect(t.itemModelIndex).toBeCloseTo(0.1);
  });

  it('falls back gracefully when fields missing', () => {
    const t = parseVanillaTrimPattern('{}');
    expect(t.assetId).toBe('');
    expect(t.templateItem).toBe('');
    const m = parseVanillaTrimMaterial('{}');
    expect(m.assetName).toBe('');
    expect(m.ingredient).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaTrimPattern('not json')).toThrow(TrimParseError);
    expect(() => parseVanillaTrimMaterial('also not')).toThrow(TrimParseError);
  });
});
