import { describe, it, expect } from 'vitest';
import { splitStackInHalf, takeOneFromStack } from './container_row_split';

describe('container row split', () => {
  it('split 8 → 4+4', () => {
    const [a, b] = splitStackInHalf({ id: 'stone', count: 8 });
    expect(a?.count).toBe(4);
    expect(b?.count).toBe(4);
  });

  it('odd favors held hand', () => {
    const [a, b] = splitStackInHalf({ id: 'stone', count: 7 });
    expect(a?.count).toBe(4);
    expect(b?.count).toBe(3);
  });

  it('single stays single', () => {
    const [a, b] = splitStackInHalf({ id: 'stone', count: 1 });
    expect(a?.count).toBe(1);
    expect(b).toBeUndefined();
  });

  it('take one reduces by 1', () => {
    const [remaining, taken] = takeOneFromStack({ id: 'stone', count: 3 });
    expect(remaining?.count).toBe(2);
    expect(taken.count).toBe(1);
  });
});
