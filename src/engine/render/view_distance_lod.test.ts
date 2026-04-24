import { describe, it, expect } from 'vitest';
import { chunkDetailForDistance, DEFAULT_DESKTOP, DEFAULT_MOBILE } from './view_distance_lod';

describe('view distance LOD', () => {
  it('close = full', () => {
    expect(chunkDetailForDistance(1, DEFAULT_DESKTOP)).toBe('full');
  });

  it('mid = half', () => {
    expect(chunkDetailForDistance(9, DEFAULT_DESKTOP)).toBe('half');
  });

  it('far = billboard', () => {
    expect(chunkDetailForDistance(20, DEFAULT_DESKTOP)).toBe('billboard');
  });

  it('very far = skip', () => {
    expect(chunkDetailForDistance(100, DEFAULT_DESKTOP)).toBe('skip');
  });

  it('mobile stricter', () => {
    expect(chunkDetailForDistance(5, DEFAULT_MOBILE)).not.toBe('full');
    expect(chunkDetailForDistance(5, DEFAULT_DESKTOP)).toBe('full');
  });
});
