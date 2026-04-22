import { describe, it, expect } from 'vitest';
import { BIOMES, pickBiome } from './biome';

describe('BIOMES', () => {
  it('has 15 biomes', () => {
    expect(Object.keys(BIOMES).length).toBe(15);
  });

  it('temperature ordering: snowy < taiga < plains < jungle < desert', () => {
    expect(BIOMES.snowy_plains.temperature).toBeLessThan(BIOMES.taiga.temperature);
    expect(BIOMES.taiga.temperature).toBeLessThan(BIOMES.plains.temperature);
    expect(BIOMES.plains.temperature).toBeLessThan(BIOMES.jungle.temperature);
    expect(BIOMES.jungle.temperature).toBeLessThan(BIOMES.desert.temperature + 0.01);
  });

  it('humidity bounds: desert ~0, jungle near 1', () => {
    expect(BIOMES.desert.humidity).toBeLessThan(0.1);
    expect(BIOMES.jungle.humidity).toBeGreaterThan(0.8);
  });

  it('pickBiome returns desert for hot+dry', () => {
    expect(pickBiome(2, 0)).toBe('desert');
  });

  it('pickBiome returns jungle for hot+humid', () => {
    expect(pickBiome(1.2, 0.9)).toBe('jungle');
  });

  it('pickBiome returns snowy_plains for cold', () => {
    expect(pickBiome(-0.4, 0.5)).toBe('snowy_plains');
  });

  it('ocean + river surface is water', () => {
    expect(BIOMES.ocean.topBlock).toBe('webmc:water');
    expect(BIOMES.river.topBlock).toBe('webmc:water');
  });

  it('jungle has highest tree density', () => {
    const densities = Object.values(BIOMES).map((b) => b.treeDensity);
    const maxDensity = Math.max(...densities);
    expect(BIOMES.jungle.treeDensity).toBe(maxDensity);
  });
});
