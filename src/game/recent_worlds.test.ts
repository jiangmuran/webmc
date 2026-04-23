import { describe, it, expect } from 'vitest';
import { push, sortByRecency, totalSizeBytes, find, MAX_RECENT } from './recent_worlds';

const mk = (name: string, t: number, size = 100) => ({
  name,
  seed: '0',
  lastPlayedMs: t,
  sizeBytes: size,
});

describe('recent worlds', () => {
  it('push adds to front', () => {
    const r = push([mk('a', 1)], mk('b', 2));
    expect(r[0]?.name).toBe('b');
  });

  it('push dedups by name', () => {
    const r = push([mk('a', 1)], mk('a', 2));
    expect(r.length).toBe(1);
    expect(r[0]?.lastPlayedMs).toBe(2);
  });

  it('caps at MAX_RECENT', () => {
    let list: ReturnType<typeof mk>[] = [];
    for (let i = 0; i < MAX_RECENT + 3; i++) list = push(list, mk(`w${i}`, i));
    expect(list.length).toBe(MAX_RECENT);
  });

  it('sort recency', () => {
    const s = sortByRecency([mk('a', 1), mk('b', 10), mk('c', 5)]);
    expect(s[0]?.name).toBe('b');
  });

  it('total size', () => {
    expect(totalSizeBytes([mk('a', 1, 50), mk('b', 2, 100)])).toBe(150);
  });

  it('find by name', () => {
    expect(find([mk('a', 1)], 'a')?.name).toBe('a');
    expect(find([], 'x')).toBeNull();
  });
});
