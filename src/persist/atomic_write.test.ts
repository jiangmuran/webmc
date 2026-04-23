import { describe, it, expect } from 'vitest';
import { tryCommit } from './atomic_write';

describe('atomic write', () => {
  it('commits clean', () => {
    const r = tryCommit(new Map(), [{ key: 'a', value: 1 }], new Set());
    expect(r.committed).toBe(true);
    expect(r.snapshot.get('a')).toBe(1);
  });

  it('aborts on conflict', () => {
    const r = tryCommit(new Map([['a', 0]]), [{ key: 'a', value: 1 }], new Set(['a']));
    expect(r.committed).toBe(false);
    expect(r.snapshot.get('a')).toBe(0);
  });

  it('multi writes applied', () => {
    const r = tryCommit(
      new Map(),
      [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
      ],
      new Set(),
    );
    expect(r.snapshot.size).toBe(2);
  });
});
