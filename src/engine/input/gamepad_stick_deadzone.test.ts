import { describe, it, expect } from 'vitest';
import { cleanStick, triggerWithThreshold, STICK_INNER_DEADZONE } from './gamepad_stick_deadzone';

describe('gamepad stick deadzone', () => {
  it('tiny input nulled', () => {
    expect(cleanStick(0.05, 0)).toEqual({ x: 0, y: 0 });
  });

  it('past deadzone output positive', () => {
    const r = cleanStick(1, 0);
    expect(r.x).toBeGreaterThan(0);
  });

  it('full deflection near 1', () => {
    const r = cleanStick(1, 0);
    expect(Math.abs(r.x)).toBeCloseTo(1, 1);
  });

  it('direction preserved', () => {
    const r = cleanStick(0, -1);
    expect(r.y).toBeLessThan(0);
  });

  it('trigger below threshold', () => {
    expect(triggerWithThreshold(0.2)).toBe(false);
  });

  it('trigger over threshold', () => {
    expect(triggerWithThreshold(0.8)).toBe(true);
  });

  it('custom threshold', () => {
    expect(triggerWithThreshold(0.1, 0.05)).toBe(true);
  });

  it('inner deadzone constant', () => {
    expect(STICK_INNER_DEADZONE).toBeGreaterThan(0);
  });
});
