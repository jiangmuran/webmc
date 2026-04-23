import { describe, it, expect } from 'vitest';
import { treesForBiome, treesPerChunk } from './tree_variants_per_biome';

describe('tree variants per biome', () => {
  it('forest has oak+birch', () => {
    const t = treesForBiome('forest');
    expect(t).toContain('oak');
    expect(t).toContain('birch');
  });

  it('jungle has jungle', () => {
    expect(treesForBiome('jungle')).toEqual(['jungle']);
  });

  it('desert has none', () => {
    expect(treesForBiome('desert')).toEqual([]);
  });

  it('pale garden has pale oak', () => {
    expect(treesForBiome('pale_garden')).toEqual(['pale_oak']);
  });

  it('jungle has many trees', () => {
    expect(treesPerChunk('jungle', () => 0.5)).toBeGreaterThan(10);
  });

  it('plains has few', () => {
    const n = treesPerChunk('plains', () => 0);
    expect(n).toBeLessThanOrEqual(3);
  });

  it('no trees in empty biome', () => {
    expect(treesPerChunk('desert', () => 0)).toBe(0);
  });
});
