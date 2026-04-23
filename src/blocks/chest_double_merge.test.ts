import { describe, it, expect } from 'vitest';
import { typeOnPlace, mergedCapacity } from './chest_double_merge';

describe('chest double merge', () => {
  it('alone is single', () => {
    expect(typeOnPlace({ facing: 'n' })).toBe('single');
  });

  it('facing mismatch stays single', () => {
    expect(typeOnPlace({ facing: 'n', adjacentChestFacing: 'e', adjacentSide: 'left' })).toBe(
      'single',
    );
  });

  it('right of left is right', () => {
    expect(typeOnPlace({ facing: 'n', adjacentChestFacing: 'n', adjacentSide: 'left' })).toBe(
      'right',
    );
  });

  it('left of right is left', () => {
    expect(typeOnPlace({ facing: 'n', adjacentChestFacing: 'n', adjacentSide: 'right' })).toBe(
      'left',
    );
  });

  it('capacities', () => {
    expect(mergedCapacity('single')).toBe(27);
    expect(mergedCapacity('left')).toBe(54);
  });
});
