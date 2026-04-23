import { describe, it, expect } from 'vitest';
import { applyDeadzone, toIntent, AXIS_DEADZONE } from './gamepad_mapping';

describe('gamepad mapping', () => {
  it('deadzone zeros small inputs', () => {
    expect(applyDeadzone(0.05)).toBe(0);
  });

  it('deadzone scales past threshold', () => {
    expect(applyDeadzone(1)).toBeCloseTo(1);
    expect(applyDeadzone(AXIS_DEADZONE)).toBe(0);
  });

  it('sign preserved', () => {
    expect(applyDeadzone(-0.5)).toBeLessThan(0);
  });

  it('intent forward inverts LY', () => {
    const r = toIntent({ axes: [0, -1, 0, 0], buttons: [] });
    expect(r.forward).toBeCloseTo(1);
  });

  it('strafe from LX', () => {
    const r = toIntent({ axes: [1, 0, 0, 0], buttons: [] });
    expect(r.strafe).toBeCloseTo(1);
  });

  it('jump on A', () => {
    const buttons: boolean[] = Array.from({ length: 16 }, () => false);
    buttons[0] = true;
    const r = toIntent({ axes: [0, 0, 0, 0], buttons });
    expect(r.jump).toBe(true);
  });
});
