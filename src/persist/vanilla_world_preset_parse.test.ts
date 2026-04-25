import { describe, it, expect } from 'vitest';
import { parseVanillaWorldPreset, WorldPresetParseError } from './vanilla_world_preset_parse';

describe('vanilla world_preset parser', () => {
  it('parses a 3-dimension preset', () => {
    const p = parseVanillaWorldPreset(
      JSON.stringify({
        dimensions: {
          'minecraft:overworld': {
            type: 'minecraft:overworld',
            generator: {
              type: 'minecraft:noise',
              settings: 'minecraft:overworld',
              biome_source: { type: 'minecraft:multi_noise', preset: 'minecraft:overworld' },
            },
          },
          'minecraft:the_nether': {
            type: 'minecraft:the_nether',
            generator: { type: 'minecraft:noise', settings: 'minecraft:nether' },
          },
          'minecraft:the_end': {
            type: 'minecraft:the_end',
            generator: { type: 'minecraft:noise', settings: 'minecraft:end' },
          },
        },
      }),
    );
    expect(Object.keys(p.dimensions).sort()).toEqual(['overworld', 'the_end', 'the_nether']);
    expect(p.dimensions['overworld']?.generator.kind).toBe('noise');
    expect(p.dimensions['the_nether']?.generator.settingsId).toBe('nether');
  });

  it('returns empty when dimensions missing', () => {
    expect(parseVanillaWorldPreset('{}').dimensions).toEqual({});
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaWorldPreset('not json')).toThrow(WorldPresetParseError);
  });
});
