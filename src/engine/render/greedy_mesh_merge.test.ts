import { describe, it, expect } from 'vitest';
import { mergeHorizontally } from './greedy_mesh_merge';

describe('greedy mesh merge', () => {
  it('merges adjacent', () => {
    const r = mergeHorizontally([
      { x: 0, y: 0, w: 1, h: 1, block: 'stone' },
      { x: 1, y: 0, w: 1, h: 1, block: 'stone' },
    ]);
    expect(r).toHaveLength(1);
    expect(r[0]?.w).toBe(2);
  });

  it('different block does not merge', () => {
    const r = mergeHorizontally([
      { x: 0, y: 0, w: 1, h: 1, block: 'stone' },
      { x: 1, y: 0, w: 1, h: 1, block: 'dirt' },
    ]);
    expect(r).toHaveLength(2);
  });

  it('gap does not merge', () => {
    const r = mergeHorizontally([
      { x: 0, y: 0, w: 1, h: 1, block: 'stone' },
      { x: 5, y: 0, w: 1, h: 1, block: 'stone' },
    ]);
    expect(r).toHaveLength(2);
  });

  it('empty in empty out', () => {
    expect(mergeHorizontally([])).toEqual([]);
  });
});
