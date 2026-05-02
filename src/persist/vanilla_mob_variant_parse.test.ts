import { describe, it, expect } from 'vitest';
import { parseVanillaMobVariant, MobVariantParseError } from './vanilla_mob_variant_parse';

describe('vanilla mob variant parser', () => {
  it('parses a wolf variant', () => {
    const v = parseVanillaMobVariant(
      JSON.stringify({
        asset_id: 'minecraft:entity/wolf/wolf_pale',
        model: 'normal',
        spawn_conditions: [{ type: 'minecraft:tag', tag: '#minecraft:is_taiga' }],
      }),
    );
    expect(v.assetId).toBe('webmc:entity/wolf/wolf_pale');
    expect(v.model).toBe('normal');
    expect(v.spawnConditions.length).toBe(1);
    expect(v.spawnConditions[0]?.type).toBe('webmc:tag');
    expect(v.spawnConditions[0]?.raw['tag']).toBe('#minecraft:is_taiga');
  });

  it('parses a cat variant with no model', () => {
    const v = parseVanillaMobVariant(
      JSON.stringify({
        asset_id: 'minecraft:entity/cat/black',
        spawn_conditions: [],
      }),
    );
    expect(v.model).toBeNull();
    expect(v.spawnConditions).toEqual([]);
  });

  it('falls back when fields missing', () => {
    const v = parseVanillaMobVariant('{}');
    expect(v.assetId).toBe('');
    expect(v.model).toBeNull();
    expect(v.spawnConditions).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaMobVariant('not json')).toThrow(MobVariantParseError);
  });
});
