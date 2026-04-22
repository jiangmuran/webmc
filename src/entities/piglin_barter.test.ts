import { describe, it, expect } from 'vitest';
import {
  rollBarter,
  totalWeight,
  PIGLIN_BARTER_TABLE,
  PIGLIN_BARTER_COOLDOWN_TICKS,
} from './piglin_barter';

describe('piglin barter', () => {
  it('total weight matches sum', () => {
    const sum = PIGLIN_BARTER_TABLE.reduce((s, e) => s + e.weight, 0);
    expect(totalWeight()).toBe(sum);
  });

  it('deterministic roll at 0', () => {
    const first = PIGLIN_BARTER_TABLE[0]?.item;
    expect(rollBarter(() => 0).item).toBe(first);
  });

  it('roll near 1 returns last', () => {
    const last = PIGLIN_BARTER_TABLE[PIGLIN_BARTER_TABLE.length - 1]?.item;
    expect(rollBarter(() => 0.9999).item).toBe(last);
  });

  it('all 1000 rolls in table', () => {
    const ids = new Set(PIGLIN_BARTER_TABLE.map((e) => e.item));
    for (let i = 0; i < 1000; i++) {
      expect(ids.has(rollBarter(Math.random).item)).toBe(true);
    }
  });

  it('cooldown 2s', () => {
    expect(PIGLIN_BARTER_COOLDOWN_TICKS).toBe(40);
  });
});
