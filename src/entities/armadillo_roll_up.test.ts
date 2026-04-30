import { describe, it, expect } from 'vitest';
import { shouldRoll, rolledDamage, dropsScuteOnShed } from './armadillo_roll_up';

describe('armadillo roll up', () => {
  it('rolls when scared', () => {
    expect(shouldRoll({ isScared: true, rolledTicks: 0 })).toBe(true);
  });

  it('close threat rolls', () => {
    expect(shouldRoll({ isScared: false, rolledTicks: 0, nearbyThreatDistance: 3 })).toBe(true);
  });

  it('far threat unrolled', () => {
    expect(shouldRoll({ isScared: false, rolledTicks: 0, nearbyThreatDistance: 30 })).toBe(false);
  });

  it('rolled takes (raw - 1)/2 damage (wiki, not immune)', () => {
    // 7 → (7-1)/2 = 3
    expect(rolledDamage({ isScared: true, rolledTicks: 10 }, 7)).toBe(3);
  });

  it('rolled clamps at 0 for ≤1 damage', () => {
    expect(rolledDamage({ isScared: true, rolledTicks: 0 }, 1)).toBe(0);
  });

  it('unrolled takes raw damage', () => {
    expect(rolledDamage({ isScared: false, rolledTicks: 0 }, 5)).toBe(5);
  });

  it('scute drop rare', () => {
    expect(dropsScuteOnShed({ isScared: false, rolledTicks: 0 }, () => 0)).toBe(true);
    expect(dropsScuteOnShed({ isScared: false, rolledTicks: 0 }, () => 0.99)).toBe(false);
  });
});
