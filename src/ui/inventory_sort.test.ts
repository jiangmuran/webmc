import { describe, it, expect } from 'vitest';
import { stackTogether, sortAlphabetical } from './inventory_sort';

describe('inventory sort', () => {
  it('merges same id', () => {
    const r = stackTogether([
      { id: 'stone', count: 30 },
      { id: 'stone', count: 30 },
    ]);
    expect(r).toEqual([{ id: 'stone', count: 60 }]);
  });

  it('splits over max stack', () => {
    const r = stackTogether([
      { id: 'stone', count: 70 },
      { id: 'stone', count: 70 },
    ]);
    expect(r).toEqual([
      { id: 'stone', count: 64 },
      { id: 'stone', count: 64 },
      { id: 'stone', count: 12 },
    ]);
  });

  it('alpha sort', () => {
    expect(
      sortAlphabetical([
        { id: 'stone', count: 1 },
        { id: 'apple', count: 1 },
      ])[0]?.id,
    ).toBe('apple');
  });
});
