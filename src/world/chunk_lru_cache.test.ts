import { describe, it, expect } from 'vitest';
import { makeLRU, get, set, size, has } from './chunk_lru_cache';

describe('chunk lru cache', () => {
  it('stores + retrieves', () => {
    const c = makeLRU<number>(3);
    set(c, 'a', 1);
    expect(get(c, 'a')).toBe(1);
  });

  it('evicts oldest', () => {
    const c = makeLRU<number>(2);
    set(c, 'a', 1);
    set(c, 'b', 2);
    const evicted = set(c, 'c', 3);
    expect(evicted).toBe(1);
    expect(has(c, 'a')).toBe(false);
  });

  it('get refreshes LRU', () => {
    const c = makeLRU<number>(2);
    set(c, 'a', 1);
    set(c, 'b', 2);
    get(c, 'a');
    set(c, 'c', 3);
    expect(has(c, 'a')).toBe(true);
    expect(has(c, 'b')).toBe(false);
  });

  it('size tracks', () => {
    const c = makeLRU<number>(3);
    set(c, 'a', 1);
    set(c, 'b', 2);
    expect(size(c)).toBe(2);
  });

  it('reset overwrites without eviction under cap', () => {
    const c = makeLRU<number>(2);
    set(c, 'a', 1);
    expect(set(c, 'a', 2)).toBeUndefined();
    expect(get(c, 'a')).toBe(2);
  });
});
