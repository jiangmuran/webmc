import { describe, it, expect } from 'vitest';
import {
  accelerationPerTick,
  effectiveTopSpeed,
  brakeForUnpowered,
  MAX_POWERED_SPEED,
  type PoweredRailInput,
} from './powered_rail_speed';

const baseline: PoweredRailInput = {
  rails: 8,
  isPowered: true,
  currentSpeed: 0.2,
  passenger: true,
};

describe('powered rail speed', () => {
  it('unpowered no accel', () => {
    expect(accelerationPerTick({ ...baseline, isPowered: false })).toBe(0);
  });

  it('passenger stronger than empty', () => {
    const full = accelerationPerTick({ ...baseline, passenger: true });
    const empty = accelerationPerTick({ ...baseline, passenger: false });
    expect(full).toBeGreaterThan(empty);
  });

  it('top speed fixed', () => {
    expect(effectiveTopSpeed(baseline)).toBe(MAX_POWERED_SPEED);
  });

  it('unpowered brakes hard', () => {
    expect(brakeForUnpowered(0.4, false)).toBe(0.2);
  });

  it('powered keeps speed', () => {
    expect(brakeForUnpowered(0.4, true)).toBe(0.4);
  });
});
