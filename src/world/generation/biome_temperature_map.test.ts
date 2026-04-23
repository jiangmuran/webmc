import { describe, it, expect } from 'vitest';
import { biomeTemperature, snowsInBiome, rainsInBiome, dryInBiome } from './biome_temperature_map';

describe('biome temperature map', () => {
  it('desert is hot', () => {
    expect(biomeTemperature('desert')).toBe(2);
  });

  it('snowy plains freezes', () => {
    expect(biomeTemperature('snowy_plains')).toBe(0);
  });

  it('snows in snowy', () => {
    expect(snowsInBiome('snowy_plains')).toBe(true);
  });

  it('rains in forest', () => {
    expect(rainsInBiome('forest')).toBe(true);
  });

  it('no rain in desert', () => {
    expect(rainsInBiome('desert')).toBe(false);
  });

  it('dry biomes', () => {
    expect(dryInBiome('desert')).toBe(true);
    expect(dryInBiome('savanna')).toBe(true);
    expect(dryInBiome('forest')).toBe(false);
  });
});
