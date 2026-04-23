import { describe, it, expect } from 'vitest';
import { cascadeSplits, splitForFragment, DEFAULT_CASCADE_COUNT } from './shadow_cascade_split';

describe('shadow cascade split', () => {
  it('produces N splits', () => {
    expect(cascadeSplits(0.1, 1000, 3)).toHaveLength(3);
  });

  it('monotonically increases', () => {
    const s = cascadeSplits(0.1, 1000, 4);
    for (let i = 1; i < s.length; i++) {
      const a = s[i];
      const b = s[i - 1];
      if (a === undefined || b === undefined) throw new Error('unreachable');
      expect(a).toBeGreaterThan(b);
    }
  });

  it('last split = far', () => {
    const s = cascadeSplits(0.1, 1000, 3);
    expect(s[s.length - 1]).toBeCloseTo(1000);
  });

  it('fragment 0 in first cascade', () => {
    const s = cascadeSplits(0.1, 1000, 3);
    expect(splitForFragment(1, s)).toBe(0);
  });

  it('fragment far in last cascade', () => {
    const s = cascadeSplits(0.1, 1000, 3);
    expect(splitForFragment(900, s)).toBe(2);
  });

  it('default count', () => {
    expect(DEFAULT_CASCADE_COUNT).toBe(3);
  });
});
