import { describe, it, expect } from 'vitest';
import { defaultLodSettings, lodForChunk, subsampleFactor, tierVertexFraction } from './chunk_lod';

describe('chunk LOD', () => {
  const s = defaultLodSettings(12);

  it('chunk under camera is tier 0', () => {
    expect(lodForChunk(0, 0, 0, 0, s)).toBe(0);
  });

  it('medium distance is tier 1', () => {
    expect(lodForChunk(5, 0, 0, 0, s)).toBe(1);
  });

  it('edge distance is tier 2', () => {
    expect(lodForChunk(9, 0, 0, 0, s)).toBe(2);
  });

  it('beyond view distance is culled', () => {
    expect(lodForChunk(20, 0, 0, 0, s)).toBe(-1);
  });

  it('subsample factor grows with tier', () => {
    expect(subsampleFactor(0)).toBe(1);
    expect(subsampleFactor(1)).toBe(2);
    expect(subsampleFactor(3)).toBe(8);
  });

  it('higher tier = fewer vertices', () => {
    expect(tierVertexFraction(0)).toBe(1);
    expect(tierVertexFraction(1)).toBeLessThan(1);
    expect(tierVertexFraction(3)).toBeLessThan(tierVertexFraction(1));
  });

  it('culled chunks render 0 vertices conceptually', () => {
    expect(lodForChunk(50, 50, 0, 0, s)).toBe(-1);
  });
});
