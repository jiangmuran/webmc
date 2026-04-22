import { describe, it, expect } from 'vitest';
import {
  clampPitch,
  defaultSensitivityConfig,
  MAX_PITCH,
  mouseToLook,
  suppressDuringUI,
} from './mouse_sensitivity';

describe('mouse sensitivity', () => {
  it('default produces rotation', () => {
    const r = mouseToLook({ dxPx: 100, dyPx: 0 }, defaultSensitivityConfig());
    expect(r.yawDelta).toBeGreaterThan(0);
  });

  it('higher sensitivity = more rotation', () => {
    const low = mouseToLook(
      { dxPx: 100, dyPx: 0 },
      { ...defaultSensitivityConfig(), sensitivity: 0.1 },
    );
    const high = mouseToLook(
      { dxPx: 100, dyPx: 0 },
      { ...defaultSensitivityConfig(), sensitivity: 2 },
    );
    expect(high.yawDelta).toBeGreaterThan(low.yawDelta);
  });

  it('invertY flips sign', () => {
    const normal = mouseToLook({ dxPx: 0, dyPx: 100 }, defaultSensitivityConfig());
    const inverted = mouseToLook(
      { dxPx: 0, dyPx: 100 },
      { ...defaultSensitivityConfig(), invertY: true },
    );
    expect(Math.sign(inverted.pitchDelta)).toBe(-Math.sign(normal.pitchDelta));
  });

  it('curve exponent amplifies large deltas', () => {
    const linear = mouseToLook(
      { dxPx: 100, dyPx: 0 },
      { ...defaultSensitivityConfig(), curveExponent: 1 },
    );
    const progressive = mouseToLook(
      { dxPx: 100, dyPx: 0 },
      { ...defaultSensitivityConfig(), curveExponent: 1.5 },
    );
    expect(progressive.yawDelta).toBeGreaterThan(linear.yawDelta);
  });

  it('clampPitch prevents straight-up', () => {
    expect(clampPitch(Math.PI)).toBeLessThan(MAX_PITCH + 1e-6);
  });

  it('UI open suppresses', () => {
    const d = suppressDuringUI({ dxPx: 100, dyPx: 50 }, true);
    expect(d).toEqual({ dxPx: 0, dyPx: 0 });
  });
});
