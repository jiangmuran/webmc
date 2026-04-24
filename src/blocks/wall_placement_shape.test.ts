import { describe, it, expect } from 'vitest';
import { computeUpPost, updateConnections } from './wall_placement_shape';

describe('wall placement shape', () => {
  it('isolated wall has post', () => {
    expect(computeUpPost({ north: 'none', south: 'none', east: 'none', west: 'none' })).toBe(true);
  });

  it('straight NS drops post', () => {
    expect(computeUpPost({ north: 'low', south: 'low', east: 'none', west: 'none' })).toBe(false);
  });

  it('straight EW drops post', () => {
    expect(computeUpPost({ north: 'none', south: 'none', east: 'low', west: 'low' })).toBe(false);
  });

  it('L-shape keeps post', () => {
    expect(computeUpPost({ north: 'low', south: 'none', east: 'low', west: 'none' })).toBe(true);
  });

  it('connections north only', () => {
    const c = updateConnections({ north: true, south: false, east: false, west: false });
    expect(c.north).toBe('low');
    expect(c.south).toBe('none');
  });
});
