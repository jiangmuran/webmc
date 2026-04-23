import { describe, it, expect } from 'vitest';
import { combine, canApply } from './banner_shield_apply';

describe('banner shield apply', () => {
  it('combines patterns + base', () => {
    const r = combine(
      { baseColor: 'red', patterns: [{ id: 'cross', color: 'white' }] },
      { patterns: [], durability: 100 },
    );
    expect(r.shield.patterns.length).toBe(2);
    expect(r.shield.patterns[0]?.id).toBe('base');
  });

  it('preserves durability', () => {
    const r = combine({ baseColor: 'blue', patterns: [] }, { patterns: [], durability: 200 });
    expect(r.shield.durability).toBe(200);
  });

  it('canApply requires both', () => {
    expect(canApply({ baseColor: 'r', patterns: [] }, { patterns: [], durability: 1 })).toBe(true);
    expect(canApply(null, { patterns: [], durability: 1 })).toBe(false);
  });
});
