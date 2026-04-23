import { describe, it, expect } from 'vitest';
import type { Grid3x3 } from './crafting_table_grid';
import { boundingBox, isEmpty } from './crafting_table_grid';

const empty: Grid3x3 = {
  rows: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};

describe('crafting table grid', () => {
  it('empty detection', () => {
    expect(isEmpty(empty)).toBe(true);
  });

  it('no bbox when empty', () => {
    expect(boundingBox(empty)).toBeUndefined();
  });

  it('bbox wraps items', () => {
    const g: Grid3x3 = {
      rows: [
        [null, null, null],
        [null, 'plank', null],
        [null, null, null],
      ],
    };
    expect(boundingBox(g)).toEqual({ minR: 1, maxR: 1, minC: 1, maxC: 1 });
  });

  it('corners wrap', () => {
    const g: Grid3x3 = {
      rows: [
        ['a', null, null],
        [null, null, null],
        [null, null, 'b'],
      ],
    };
    expect(boundingBox(g)).toEqual({ minR: 0, maxR: 2, minC: 0, maxC: 2 });
  });
});
