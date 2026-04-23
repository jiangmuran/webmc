import { describe, it, expect } from 'vitest';
import { rotationDelta, forwardAccel, type BoatInput } from './boat_pilot_control';

const z: BoatInput = {
  forward: false,
  back: false,
  left: false,
  right: false,
  onIce: false,
  inWater: true,
};

describe('boat pilot control', () => {
  it('left turns negative', () => {
    expect(rotationDelta({ ...z, left: true })).toBe(-1);
  });

  it('right turns positive', () => {
    expect(rotationDelta({ ...z, right: true })).toBe(1);
  });

  it('both cancels', () => {
    expect(rotationDelta({ ...z, left: true, right: true })).toBe(0);
  });

  it('forward accel in water', () => {
    expect(forwardAccel({ ...z, forward: true })).toBeCloseTo(0.04);
  });

  it('ice faster than water', () => {
    expect(forwardAccel({ ...z, forward: true, onIce: true, inWater: false })).toBeGreaterThan(
      forwardAccel({ ...z, forward: true }),
    );
  });

  it('back slower than forward', () => {
    const fwd = forwardAccel({ ...z, forward: true });
    const back = forwardAccel({ ...z, back: true });
    expect(Math.abs(back)).toBeLessThan(Math.abs(fwd));
  });
});
