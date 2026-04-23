import { describe, it, expect } from 'vitest';
import { totalMobKills, topCategory } from './statistics_panel';

describe('statistics panel', () => {
  it('total kills sum', () => {
    expect(
      totalMobKills({
        general: [],
        mobKills: { zombie: 5, skeleton: 3 },
        itemsUsed: {},
      }),
    ).toBe(8);
  });

  it('top category limit', () => {
    const r = topCategory({ a: 10, b: 5, c: 7, d: 1 }, 2);
    expect(r).toHaveLength(2);
    expect(r[0]?.id).toBe('a');
  });
});
