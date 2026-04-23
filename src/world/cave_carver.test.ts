import { describe, it, expect } from 'vitest';
import { isCaveVoxel, countVoxels } from './cave_carver';

describe('cave carver', () => {
  it('y below min no cave', () => {
    expect(isCaveVoxel({ density: () => 1, threshold: 0, minY: 10, maxY: 60 }, 0, 0, 0)).toBe(
      false,
    );
  });

  it('high density → cave', () => {
    expect(isCaveVoxel({ density: () => 1, threshold: 0, minY: 0, maxY: 100 }, 0, 30, 0)).toBe(
      true,
    );
  });

  it('low density solid', () => {
    expect(isCaveVoxel({ density: () => -1, threshold: 0, minY: 0, maxY: 100 }, 0, 30, 0)).toBe(
      false,
    );
  });

  it('countVoxels iterates', () => {
    const n = countVoxels({ density: () => 1, threshold: 0, minY: 0, maxY: 100 }, 0, 10, 0, 4);
    expect(n).toBe(64);
  });
});
