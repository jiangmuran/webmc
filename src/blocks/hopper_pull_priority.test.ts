import { describe, it, expect } from 'vitest';
import { firstPullable, pullOne, HOPPER_TICK_INTERVAL } from './hopper_pull_priority';

describe('hopper pull priority', () => {
  it('empty container -1', () => {
    expect(firstPullable([{ id: null, count: 0 }])).toBe(-1);
  });

  it('first non-empty wins', () => {
    expect(
      firstPullable([
        { id: null, count: 0 },
        { id: 'dirt', count: 5 },
      ]),
    ).toBe(1);
  });

  it('pullOne takes one', () => {
    const c = [{ id: 'stone', count: 3 }];
    const r = pullOne(c);
    expect(r?.id).toBe('stone');
    expect(c[0]?.count).toBe(2);
  });

  it('pull empties slot', () => {
    const c = [{ id: 'stone', count: 1 }];
    pullOne(c);
    expect(c[0]?.id).toBeNull();
  });

  it('tick interval 8', () => {
    expect(HOPPER_TICK_INTERVAL).toBe(8);
  });
});
