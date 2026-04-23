import { describe, it, expect } from 'vitest';
import { damageAt, canBreakCharge, CHARGE_TICKS } from './guardian_laser_attack';

describe('guardian laser attack', () => {
  it('no damage while charging', () => {
    expect(damageAt(10, false)).toBe(0);
  });

  it('damage after charge', () => {
    expect(damageAt(CHARGE_TICKS, false)).toBeGreaterThan(0);
  });

  it('elder hits harder', () => {
    expect(damageAt(CHARGE_TICKS, true)).toBeGreaterThan(damageAt(CHARGE_TICKS, false));
  });

  it('block LOS cancels', () => {
    expect(canBreakCharge(false)).toBe(true);
  });
});
