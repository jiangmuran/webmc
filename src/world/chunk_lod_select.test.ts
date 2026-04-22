import { describe, it, expect } from 'vitest';
import { tierForDistance, meshDetailScale, renderInterval } from './chunk_lod_select';

describe('chunk lod select', () => {
  it('close = full', () => {
    expect(tierForDistance(0)).toBe('full');
    expect(tierForDistance(3)).toBe('full');
  });

  it('medium then coarse then billboard', () => {
    expect(tierForDistance(5)).toBe('medium');
    expect(tierForDistance(10)).toBe('coarse');
    expect(tierForDistance(20)).toBe('billboard');
  });

  it('detail decreases', () => {
    expect(meshDetailScale('full')).toBeGreaterThan(meshDetailScale('medium'));
    expect(meshDetailScale('medium')).toBeGreaterThan(meshDetailScale('coarse'));
    expect(meshDetailScale('coarse')).toBeGreaterThan(meshDetailScale('billboard'));
  });

  it('interval grows with distance', () => {
    expect(renderInterval('full')).toBeLessThan(renderInterval('billboard'));
  });
});
