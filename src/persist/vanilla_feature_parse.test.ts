import { describe, it, expect } from 'vitest';
import {
  parseVanillaConfiguredFeature,
  parseVanillaPlacedFeature,
  FeatureParseError,
} from './vanilla_feature_parse';

describe('vanilla feature parser', () => {
  it('parses a configured_feature with mapped type', () => {
    const c = parseVanillaConfiguredFeature(
      JSON.stringify({ type: 'minecraft:tree', config: { trunk_height: 4 } }),
    );
    expect(c.type).toBe('webmc:tree');
    expect(c.raw['config']).toEqual({ trunk_height: 4 });
  });

  it('parses placed_feature with string feature ref + placement modifiers', () => {
    const p = parseVanillaPlacedFeature(
      JSON.stringify({
        feature: 'minecraft:trees_oak',
        placement: [
          { type: 'minecraft:count', count: 5 },
          { type: 'minecraft:in_square' },
          { type: 'minecraft:heightmap', heightmap: 'OCEAN_FLOOR' },
        ],
      }),
    );
    expect(p.feature).toBe('webmc:trees_oak');
    expect(p.placement.map((m) => m.type)).toEqual([
      'webmc:count',
      'webmc:in_square',
      'webmc:heightmap',
    ]);
  });

  it('parses placed_feature with inline configured_feature', () => {
    const p = parseVanillaPlacedFeature(
      JSON.stringify({
        feature: { type: 'minecraft:flower', config: {} },
        placement: [],
      }),
    );
    if (typeof p.feature === 'string') throw new Error('expected inline feature');
    expect(p.feature.type).toBe('webmc:flower');
  });

  it('falls back when fields missing', () => {
    const p = parseVanillaPlacedFeature('{}');
    expect(p.feature).toBe('');
    expect(p.placement).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaConfiguredFeature('not json')).toThrow(FeatureParseError);
    expect(() => parseVanillaPlacedFeature('not json')).toThrow(FeatureParseError);
  });
});
