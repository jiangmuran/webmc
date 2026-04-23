import { describe, it, expect } from 'vitest';
import { parseSelector, defaultLimit } from './target_selector';

describe('target selector', () => {
  it('@p', () => {
    const s = parseSelector('@p');
    expect(s?.prefix).toBe('@p');
  });

  it('with filters', () => {
    const s = parseSelector('@e[type=zombie,limit=3]');
    expect(s?.filters.type).toBe('zombie');
    expect(s?.filters.limit).toBe(3);
  });

  it('multiple tags', () => {
    const s = parseSelector('@a[tag=staff,tag=vip]');
    expect(s?.filters.tags?.length).toBe(2);
  });

  it('invalid returns null', () => {
    expect(parseSelector('@x')).toBeNull();
    expect(parseSelector('@p[bad')).toBeNull();
  });

  it('default limit', () => {
    expect(defaultLimit('@p')).toBe(1);
    expect(defaultLimit('@a')).toBe(Infinity);
  });
});
