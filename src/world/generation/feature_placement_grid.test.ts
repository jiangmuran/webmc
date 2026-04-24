import { describe, it, expect } from 'vitest';
import { gridCellFor, isChosenChunk, type GridFeature } from './feature_placement_grid';

describe('feature placement grid', () => {
  it('grid cell aligns', () => {
    expect(gridCellFor(10, 0, 32)).toEqual({ gx: 0, gz: 0 });
  });

  it('next cell', () => {
    expect(gridCellFor(32, 32, 32)).toEqual({ gx: 1, gz: 1 });
  });

  it('deterministic for seed', () => {
    const f: GridFeature = { spacing: 32, separation: 8, salt: 10387319 };
    expect(isChosenChunk(5, 7, f, 42)).toBe(isChosenChunk(5, 7, f, 42));
  });

  it('at most one chunk per cell chosen', () => {
    const f: GridFeature = { spacing: 32, separation: 8, salt: 10387319 };
    let count = 0;
    for (let x = 0; x < 32; x++) {
      for (let z = 0; z < 32; z++) {
        if (isChosenChunk(x, z, f, 123)) count++;
      }
    }
    expect(count).toBeLessThanOrEqual(1);
  });
});
