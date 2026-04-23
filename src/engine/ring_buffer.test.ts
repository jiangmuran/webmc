import { describe, it, expect } from 'vitest';
import { makeRing, push, shift, peek, length } from './ring_buffer';

describe('ring buffer', () => {
  it('push + shift FIFO', () => {
    const r = makeRing<number>(4);
    push(r, 1);
    push(r, 2);
    push(r, 3);
    expect(shift(r)).toBe(1);
    expect(shift(r)).toBe(2);
  });

  it('drops oldest on overflow', () => {
    const r = makeRing<number>(2, true);
    push(r, 1);
    push(r, 2);
    push(r, 3);
    expect(shift(r)).toBe(2);
  });

  it('rejects when full + !dropOldest', () => {
    const r = makeRing<number>(2, false);
    push(r, 1);
    push(r, 2);
    expect(push(r, 3)).toBe(false);
  });

  it('peek at index', () => {
    const r = makeRing<number>(3);
    push(r, 10);
    push(r, 20);
    expect(peek(r, 0)).toBe(10);
    expect(peek(r, 1)).toBe(20);
    expect(peek(r, 5)).toBeUndefined();
  });

  it('length tracks', () => {
    const r = makeRing<number>(3);
    expect(length(r)).toBe(0);
    push(r, 1);
    expect(length(r)).toBe(1);
  });
});
