import { describe, it, expect } from 'vitest';
import { yawPitchDelta, clampPitch } from './touch_look_pad';

describe('touch look pad', () => {
  it('yaw scales with dx', () => {
    const { yawDeg } = yawPitchDelta({
      startX: 0,
      startY: 0,
      currentX: 100,
      currentY: 0,
      sensitivity: 0.5,
    });
    expect(yawDeg).toBe(50);
  });

  it('pitch scales with dy', () => {
    const { pitchDeg } = yawPitchDelta({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 100,
      sensitivity: 0.25,
    });
    expect(pitchDeg).toBe(25);
  });

  it('clamp vertical', () => {
    expect(clampPitch(150)).toBeLessThan(90);
    expect(clampPitch(-150)).toBeGreaterThan(-90);
  });
});
