import { describe, it, expect } from 'vitest';
import { densityFor, treesPerChunk } from './biome_tree_density';

describe('biome tree density', () => {
  it('desert has no trees', () => {
    expect(densityFor('desert')).toBe(0);
  });

  it('jungle densest', () => {
    expect(densityFor('jungle')).toBeGreaterThan(densityFor('forest'));
  });

  it('unknown biome default', () => {
    expect(densityFor('nonexistent')).toBe(0.05);
  });

  it('per-chunk jungle many', () => {
    expect(treesPerChunk('jungle')).toBeGreaterThan(treesPerChunk('plains'));
  });

  it('plains few trees', () => {
    expect(treesPerChunk('plains')).toBeGreaterThan(0);
    expect(treesPerChunk('plains')).toBeLessThan(20);
  });

  it('ocean empty', () => {
    expect(treesPerChunk('ocean')).toBe(0);
  });
});
