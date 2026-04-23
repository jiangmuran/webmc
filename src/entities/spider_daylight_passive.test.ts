import { describe, it, expect } from 'vitest';
import { isHostile } from './spider_daylight_passive';

describe('spider daylight passive', () => {
  it('dark = hostile', () => {
    expect(isHostile({ lightLevel: 0, isAttacking: false, wasHitRecently: false })).toBe(true);
  });

  it('light = passive', () => {
    expect(isHostile({ lightLevel: 15, isAttacking: false, wasHitRecently: false })).toBe(false);
  });

  it('hit makes hostile', () => {
    expect(isHostile({ lightLevel: 15, isAttacking: false, wasHitRecently: true })).toBe(true);
  });
});
