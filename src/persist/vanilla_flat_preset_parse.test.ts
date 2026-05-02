import { describe, it, expect } from 'vitest';
import { parseVanillaFlatPreset, FlatPresetParseError } from './vanilla_flat_preset_parse';

describe('vanilla flat_level_generator_preset parser', () => {
  it('parses the classic flat-world preset', () => {
    const p = parseVanillaFlatPreset(
      JSON.stringify({
        biome: 'minecraft:plains',
        lakes: false,
        features: true,
        structure_overrides: ['minecraft:village'],
        layers: [
          { block: 'minecraft:bedrock', height: 1 },
          { block: 'minecraft:dirt', height: 2 },
          { block: 'minecraft:grass_block', height: 1 },
        ],
      }),
    );
    expect(p.biome).toBe('plains');
    expect(p.features).toBe(true);
    expect(p.lakes).toBe(false);
    expect(p.structureOverrides).toEqual(['village']);
    expect(p.layers).toHaveLength(3);
    expect(p.layers[0]?.block).toBe('webmc:bedrock');
    expect(p.layers[2]?.block).toBe('webmc:grass_block');
    expect(p.totalHeight).toBe(4);
  });

  it('falls back to defaults when fields missing', () => {
    const p = parseVanillaFlatPreset('{}');
    expect(p.biome).toBe('plains');
    expect(p.layers).toEqual([]);
    expect(p.structureOverrides).toEqual([]);
    expect(p.totalHeight).toBe(0);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaFlatPreset('nope')).toThrow(FlatPresetParseError);
  });
});
