import { describe, it, expect } from 'vitest';
import { isHostile } from './spider_daylight_passive';

describe('spider daylight passive', () => {
  it('dark = hostile', () => {
    expect(isHostile({ lightLevel: 0, isAttacking: false, wasHitRecently: false })).toBe(true);
  });

  it('light 12+ = passive (wiki)', () => {
    expect(isHostile({ lightLevel: 12, isAttacking: false, wasHitRecently: false })).toBe(false);
    expect(isHostile({ lightLevel: 15, isAttacking: false, wasHitRecently: false })).toBe(false);
  });

  it('light 11 = still hostile (wiki: hostile at ≤ 11)', () => {
    expect(isHostile({ lightLevel: 11, isAttacking: false, wasHitRecently: false })).toBe(true);
  });

  it('hit makes hostile', () => {
    expect(isHostile({ lightLevel: 15, isAttacking: false, wasHitRecently: true })).toBe(true);
  });
});
