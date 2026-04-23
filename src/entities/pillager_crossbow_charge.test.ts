import { describe, it, expect } from 'vitest';
import { inRange, charging, readyToFire, CHARGE_REQUIRED_TICKS } from './pillager_crossbow_charge';

describe('pillager crossbow charge', () => {
  it('in range at 5', () => {
    expect(inRange({ targetDistance: 5, chargeTicks: 0, cooldownTicks: 0 })).toBe(true);
  });

  it('charging counts ticks', () => {
    expect(charging({ targetDistance: 5, chargeTicks: 5, cooldownTicks: 0 })).toBe(true);
    expect(
      charging({ targetDistance: 5, chargeTicks: CHARGE_REQUIRED_TICKS, cooldownTicks: 0 }),
    ).toBe(false);
  });

  it('ready after charge', () => {
    expect(
      readyToFire({ targetDistance: 5, chargeTicks: CHARGE_REQUIRED_TICKS, cooldownTicks: 0 }),
    ).toBe(true);
  });

  it('cooldown blocks fire', () => {
    expect(
      readyToFire({ targetDistance: 5, chargeTicks: CHARGE_REQUIRED_TICKS, cooldownTicks: 10 }),
    ).toBe(false);
  });
});
