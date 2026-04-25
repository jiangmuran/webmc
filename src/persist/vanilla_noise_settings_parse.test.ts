import { describe, it, expect } from 'vitest';
import { parseVanillaNoiseSettings, NoiseSettingsParseError } from './vanilla_noise_settings_parse';

describe('vanilla noise_settings parser', () => {
  it('parses overworld-shaped settings', () => {
    const s = parseVanillaNoiseSettings(
      JSON.stringify({
        sea_level: 63,
        disable_mob_generation: false,
        aquifers_enabled: true,
        ore_veins_enabled: true,
        legacy_random_source: false,
        default_block: { Name: 'minecraft:stone' },
        default_fluid: { Name: 'minecraft:water' },
        noise: { min_y: -64, height: 384, size_horizontal: 1, size_vertical: 2 },
      }),
    );
    expect(s.seaLevel).toBe(63);
    expect(s.disableMobGeneration).toBe(false);
    expect(s.aquifersEnabled).toBe(true);
    expect(s.oreVeinsEnabled).toBe(true);
    expect(s.legacyRandomSource).toBe(false);
    expect(s.defaultBlock).toBe('webmc:stone');
    expect(s.defaultFluid).toBe('webmc:water');
    expect(s.noise).toEqual({
      minY: -64,
      height: 384,
      sizeHorizontal: 1,
      sizeVertical: 2,
    });
  });

  it('reads default_block as a plain string id', () => {
    const s = parseVanillaNoiseSettings(JSON.stringify({ default_block: 'minecraft:netherrack' }));
    expect(s.defaultBlock).toBe('webmc:netherrack');
  });

  it('falls back gracefully when fields missing', () => {
    const s = parseVanillaNoiseSettings('{}');
    expect(s.seaLevel).toBe(63);
    expect(s.aquifersEnabled).toBe(true);
    expect(s.defaultBlock).toBe('');
    expect(s.noise.height).toBe(256);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaNoiseSettings('nope')).toThrow(NoiseSettingsParseError);
  });
});
