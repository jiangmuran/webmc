import { describe, it, expect } from 'vitest';
import {
  fullness,
  insert,
  extractLast,
  remainingSpace,
  BUNDLE_CAPACITY,
} from './bundle_insert_extract';

describe('bundle insert extract', () => {
  it('empty has full capacity', () => {
    expect(remainingSpace({ items: [] })).toBe(BUNDLE_CAPACITY);
  });

  it('insert 64 stackable items fills', () => {
    const b = { items: [] };
    const n = insert(b, { id: 'cobble', count: 64, maxStack: 64 });
    expect(n).toBe(64);
    expect(fullness(b)).toBe(64);
  });

  it('insert partial when not enough room', () => {
    const b = { items: [{ id: 'dirt', count: 32, maxStack: 64 }] };
    const n = insert(b, { id: 'stone', count: 64, maxStack: 64 });
    expect(n).toBe(32);
  });

  it('extractLast returns most recent', () => {
    const b = { items: [] };
    insert(b, { id: 'a', count: 1, maxStack: 64 });
    insert(b, { id: 'b', count: 1, maxStack: 64 });
    expect(extractLast(b)?.id).toBe('b');
  });

  it('extract empty null', () => {
    expect(extractLast({ items: [] })).toBeNull();
  });

  it('non-stackable (maxStack=1) takes full slot', () => {
    const b = { items: [] };
    const n = insert(b, { id: 'sword', count: 1, maxStack: 1 });
    expect(n).toBe(1);
    expect(fullness(b)).toBe(64);
  });
});
