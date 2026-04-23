import { describe, it, expect } from 'vitest';
import { makeHeap, push, pop, size } from './priority_queue';

describe('priority queue', () => {
  it('empty pop undefined', () => {
    expect(pop(makeHeap<number>())).toBeUndefined();
  });

  it('pops ascending', () => {
    const h = makeHeap<number>();
    for (const n of [5, 3, 8, 1, 9, 2]) push(h, n, n);
    const out: number[] = [];
    while (size(h) > 0) {
      const v = pop(h);
      if (v !== undefined) out.push(v);
    }
    expect(out).toEqual([1, 2, 3, 5, 8, 9]);
  });

  it('size tracks', () => {
    const h = makeHeap<string>();
    push(h, 'a', 1);
    push(h, 'b', 2);
    expect(size(h)).toBe(2);
    pop(h);
    expect(size(h)).toBe(1);
  });
});
