import { describe, it, expect } from 'vitest';
import { put, touch } from './chunk_lru_evict';

const empty = { entries: new Map<string, number>(), accessOrder: [] as string[], capacity: 2 };

describe('chunk lru evict', () => {
  it('evicts oldest', () => {
    let s = put(empty, 'a', 1);
    s = put(s, 'b', 2);
    s = put(s, 'c', 3);
    expect(s.entries.has('a')).toBe(false);
    expect(s.entries.has('c')).toBe(true);
  });

  it('touch prevents eviction', () => {
    let s = put(empty, 'a', 1);
    s = put(s, 'b', 2);
    s = touch(s, 'a');
    s = put(s, 'c', 3);
    expect(s.entries.has('a')).toBe(true);
    expect(s.entries.has('b')).toBe(false);
  });

  it('update in place', () => {
    let s = put(empty, 'a', 1);
    s = put(s, 'a', 2);
    expect(s.entries.get('a')).toBe(2);
  });
});
