import { describe, it, expect } from 'vitest';
import { lodForDistance, verticesPerChunk } from './lod_chunk_detail';

describe('lod chunk detail', () => {
  it('close = LOD 0', () => {
    expect(lodForDistance(10)).toBe(0);
  });

  it('far = LOD 3', () => {
    expect(lodForDistance(1000)).toBe(3);
  });

  it('lower LOD less detail', () => {
    expect(verticesPerChunk(3)).toBeLessThan(verticesPerChunk(0));
  });

  it('mid distance mid LOD', () => {
    expect(lodForDistance(100)).toBe(1);
  });
});
