import { describe, it, expect } from 'vitest';
import { initCam, updateInput, tick } from './camera_smoothing';

describe('camera smoothing', () => {
  it('no smoothing snaps', () => {
    let c = initCam();
    c = updateInput(c, 30, 0);
    c = tick(c);
    expect(c.yaw).toBe(30);
  });

  it('smoothing lags', () => {
    let c = { ...initCam(), smoothing: 0.5 };
    c = updateInput(c, 100, 0);
    c = tick(c);
    expect(c.yaw).toBeLessThan(100);
  });

  it('pitch clamps ±90', () => {
    let c = initCam();
    c = updateInput(c, 0, 1000);
    expect(c.pitchTarget).toBe(90);
  });

  it('converges over time', () => {
    let c = { ...initCam(), smoothing: 0.5 };
    c = updateInput(c, 90, 0);
    for (let i = 0; i < 100; i++) c = tick(c);
    expect(c.yaw).toBeCloseTo(90);
  });
});
