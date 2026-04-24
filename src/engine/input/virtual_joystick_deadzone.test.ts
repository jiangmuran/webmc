import { describe, it, expect } from 'vitest';
import { applyDeadzone, magnitude, DEADZONE_RADIUS } from './virtual_joystick_deadzone';

describe('virtual joystick deadzone', () => {
  it('tiny input suppressed', () => {
    expect(applyDeadzone({ x: 0.01, y: 0 })).toEqual({ x: 0, y: 0 });
  });

  it('past deadzone positive', () => {
    const r = applyDeadzone({ x: 0.5, y: 0 });
    expect(r.x).toBeGreaterThan(0);
  });

  it('full push around 1', () => {
    expect(magnitude(applyDeadzone({ x: 1, y: 0 }))).toBeCloseTo(1, 1);
  });

  it('clamps above max', () => {
    expect(magnitude(applyDeadzone({ x: 10, y: 0 }))).toBeLessThanOrEqual(1 + 1e-6);
  });

  it('deadzone radius set', () => {
    expect(DEADZONE_RADIUS).toBeGreaterThan(0);
  });
});
