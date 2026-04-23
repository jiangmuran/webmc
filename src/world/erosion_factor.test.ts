import { describe, it, expect } from 'vitest';
import { bucketOf, surfaceSmoothness } from './erosion_factor';

describe('erosion factor', () => {
  it('low erosion E0', () => {
    expect(bucketOf(-0.9)).toBe('E0');
  });

  it('flat plains E6', () => {
    expect(bucketOf(0.9)).toBe('E6');
  });

  it('mid bucket', () => {
    expect(bucketOf(0)).toBe('E3');
  });

  it('smoothness rises', () => {
    expect(surfaceSmoothness('E6')).toBeGreaterThan(surfaceSmoothness('E0'));
  });
});
