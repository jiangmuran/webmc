import { describe, it, expect } from 'vitest';
import { parseVanillaDimension, DimensionParseError } from './vanilla_dimension_parse';

describe('vanilla dimension parser', () => {
  it('parses an overworld noise generator with multi-noise biome source', () => {
    const d = parseVanillaDimension(
      JSON.stringify({
        type: 'minecraft:overworld',
        generator: {
          type: 'minecraft:noise',
          settings: 'minecraft:overworld',
          biome_source: {
            type: 'minecraft:multi_noise',
            preset: 'minecraft:overworld',
          },
        },
      }),
    );
    expect(d.typeId).toBe('overworld');
    expect(d.generator.kind).toBe('noise');
    expect(d.generator.settingsId).toBe('overworld');
    expect(d.generator.biomeSourceKind).toBe('multi_noise');
    expect(d.generator.biomeSourcePreset).toBe('overworld');
  });

  it('parses a flat dimension', () => {
    const d = parseVanillaDimension(
      JSON.stringify({
        type: 'minecraft:overworld',
        generator: {
          type: 'minecraft:flat',
          settings: { layers: [{ block: 'minecraft:bedrock', height: 1 }] },
        },
      }),
    );
    expect(d.generator.kind).toBe('flat');
    // settings was an object, not a string ID — settingsId stays empty.
    expect(d.generator.settingsId).toBe('');
  });

  it('marks unknown generator kind', () => {
    const d = parseVanillaDimension(
      JSON.stringify({
        type: 'minecraft:overworld',
        generator: { type: 'mymod:custom_gen' },
      }),
    );
    expect(d.generator.kind).toBe('unknown');
  });

  it('falls back gracefully when fields are missing', () => {
    const d = parseVanillaDimension('{}');
    expect(d.typeId).toBe('overworld');
    expect(d.generator.kind).toBe('unknown');
    expect(d.generator.settingsId).toBe('');
    expect(d.generator.biomeSourceKind).toBe('');
    expect(d.generator.biomeSourcePreset).toBeNull();
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaDimension('not json')).toThrow(DimensionParseError);
  });
});
