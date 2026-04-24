import { describe, it, expect } from 'vitest';
import { appliedLook, clampPitch, PITCH_CLAMP } from './mouse_accel_curve';

describe('mouse accel curve', () => {
  it('no movement no rotation', () => {
    expect(
      appliedLook({
        dxPx: 0,
        dyPx: 0,
        dtMs: 16,
        baseSensitivity: 0.01,
        accelerationEnabled: false,
      }),
    ).toEqual({
      yaw: 0,
      pitch: 0,
    });
  });

  it('acceleration amplifies fast swipes', () => {
    const slow = appliedLook({
      dxPx: 10,
      dyPx: 0,
      dtMs: 100,
      baseSensitivity: 0.01,
      accelerationEnabled: true,
    });
    const fast = appliedLook({
      dxPx: 100,
      dyPx: 0,
      dtMs: 16,
      baseSensitivity: 0.01,
      accelerationEnabled: true,
    });
    expect(Math.abs(fast.yaw) / 100).toBeGreaterThanOrEqual(Math.abs(slow.yaw) / 10);
  });

  it('no accel when disabled', () => {
    const a = appliedLook({
      dxPx: 100,
      dyPx: 0,
      dtMs: 16,
      baseSensitivity: 0.01,
      accelerationEnabled: false,
    });
    expect(a.yaw).toBeCloseTo(100 * 0.01);
  });

  it('pitch clamped', () => {
    expect(clampPitch(10)).toBeCloseTo(PITCH_CLAMP);
    expect(clampPitch(-10)).toBeCloseTo(-PITCH_CLAMP);
  });

  it('pitch unchanged in range', () => {
    expect(clampPitch(0.5)).toBe(0.5);
  });
});
