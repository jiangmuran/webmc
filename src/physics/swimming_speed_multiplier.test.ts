import { describe, it, expect } from 'vitest';
import {
  swimSpeedMultiplier,
  swimmingActivates,
  type SwimInput,
} from './swimming_speed_multiplier';

const base: SwimInput = {
  inWater: true,
  isSwimming: true,
  depthStriderLevel: 0,
  dolphinsGrace: false,
  sprinting: false,
};

describe('swimming speed multiplier', () => {
  it('land unchanged', () => {
    expect(swimSpeedMultiplier({ ...base, inWater: false })).toBe(1);
  });

  it('walking through water slower', () => {
    expect(swimSpeedMultiplier({ ...base, isSwimming: false })).toBeLessThan(1);
  });

  it('depth strider helps', () => {
    const none = swimSpeedMultiplier(base);
    const ds = swimSpeedMultiplier({ ...base, depthStriderLevel: 3 });
    expect(ds).toBeGreaterThan(none);
  });

  it('dolphins grace boosts', () => {
    expect(swimSpeedMultiplier({ ...base, dolphinsGrace: true })).toBeGreaterThan(
      swimSpeedMultiplier(base),
    );
  });

  it('swimming activates on dive', () => {
    expect(swimmingActivates(-0.5, true)).toBe(true);
  });

  it('no swim without sprint', () => {
    expect(swimmingActivates(-0.5, false)).toBe(false);
  });

  it('sprint looking up no swim', () => {
    expect(swimmingActivates(0.5, true)).toBe(false);
  });
});
