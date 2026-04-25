import { describe, it, expect } from 'vitest';
import { parseVanillaMultiNoise, MultiNoiseParseError } from './vanilla_multi_noise_parse';

describe('vanilla multi_noise biome source parser', () => {
  it('extracts preset id when preset is a string ref', () => {
    const m = parseVanillaMultiNoise(JSON.stringify({ preset: 'minecraft:overworld' }));
    expect(m.presetId).toBe('overworld');
    expect(m.biomes).toEqual([]);
  });

  it('reads inline biome list with parameters', () => {
    const m = parseVanillaMultiNoise(
      JSON.stringify({
        biomes: [
          {
            biome: 'minecraft:plains',
            parameters: { temperature: 0.4, humidity: 0.0, depth: 0 },
          },
          {
            biome: 'minecraft:forest',
            parameters: { temperature: 0.5, humidity: 0.6, depth: 0 },
          },
        ],
      }),
    );
    expect(m.presetId).toBeNull();
    expect(m.biomes).toHaveLength(2);
    expect(m.biomes[0]?.biome).toBe('webmc:plains');
    expect(m.biomes[0]?.parameters['temperature']).toBeCloseTo(0.4);
  });

  it('handles preset object form with inline biomes', () => {
    const m = parseVanillaMultiNoise(
      JSON.stringify({
        preset: { biomes: [{ biome: 'minecraft:desert', parameters: { aridity: 1 } }] },
      }),
    );
    expect(m.presetId).toBeNull();
    expect(m.biomes).toHaveLength(1);
    expect(m.biomes[0]?.biome).toBe('webmc:desert');
  });

  it('returns empty defaults for empty input', () => {
    const m = parseVanillaMultiNoise('{}');
    expect(m.presetId).toBeNull();
    expect(m.biomes).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaMultiNoise('not json')).toThrow(MultiNoiseParseError);
  });
});
