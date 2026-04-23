import { describe, it, expect } from 'vitest';
import { mergeQuads } from './mesh_quad_merge';

describe('mesh quad merge', () => {
  it('empty mask', () => {
    expect(mergeQuads([0, 0, 0, 0], 2, 2)).toEqual([]);
  });

  it('single 1x1', () => {
    expect(mergeQuads([1, 0, 0, 0], 2, 2)).toEqual([{ x: 0, y: 0, w: 1, h: 1, value: 1 }]);
  });

  it('row merged', () => {
    const q = mergeQuads([1, 1, 1, 0, 0, 0], 3, 2);
    expect(q).toEqual([{ x: 0, y: 0, w: 3, h: 1, value: 1 }]);
  });

  it('2x2 merged', () => {
    const q = mergeQuads([1, 1, 1, 1], 2, 2);
    expect(q).toEqual([{ x: 0, y: 0, w: 2, h: 2, value: 1 }]);
  });

  it('different values not merged into single quad', () => {
    // Two vertical stripes of different values → 2 quads.
    const q = mergeQuads([1, 2, 1, 2], 2, 2);
    expect(q.length).toBe(2);
    expect(q.find((r) => r.value === 1)?.w).toBe(1);
    expect(q.find((r) => r.value === 2)?.w).toBe(1);
  });
});
