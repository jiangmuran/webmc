import { describe, it, expect } from 'vitest';
import {
  knockbackMagnitude,
  damageDealt,
  activates,
  WIND_CHARGE_MAX_KNOCKBACK,
} from './wind_charge_knockback';

describe('wind charge knockback', () => {
  it('max at center', () => {
    expect(knockbackMagnitude({ distance: 0, maxRange: 4 })).toBe(WIND_CHARGE_MAX_KNOCKBACK);
  });

  it('zero at edge', () => {
    expect(knockbackMagnitude({ distance: 4, maxRange: 4 })).toBe(0);
  });

  it('falls off linearly', () => {
    expect(knockbackMagnitude({ distance: 2, maxRange: 4 })).toBeCloseTo(
      WIND_CHARGE_MAX_KNOCKBACK / 2,
    );
  });

  it('no damage', () => {
    expect(damageDealt()).toBe(0);
  });

  it('activates door + bulb', () => {
    expect(activates('door')).toBe(true);
    expect(activates('copper_bulb')).toBe(true);
    expect(activates('stone')).toBe(false);
  });
});
