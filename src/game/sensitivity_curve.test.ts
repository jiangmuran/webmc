import { describe, it, expect } from 'vitest';
import {
  sensitivityGain,
  applySensitivity,
  maybeInvertY,
  stickCurve,
  STICK_DEADZONE,
} from './sensitivity_curve';

describe('sensitivity', () => {
  it('gain monotone', () => {
    expect(sensitivityGain(0.5)).toBeLessThan(sensitivityGain(1.5));
  });

  it('apply scales delta', () => {
    const d = applySensitivity({ dxPx: 10, dyPx: 10 }, 1);
    expect(d.dxPx).toBeGreaterThan(0);
    expect(d.dxPx).toBe(d.dyPx);
  });

  it('invert y', () => {
    expect(maybeInvertY({ dxPx: 1, dyPx: 1 }, true).dyPx).toBe(-1);
    expect(maybeInvertY({ dxPx: 1, dyPx: 1 }, false).dyPx).toBe(1);
  });

  it('stick deadzone', () => {
    expect(stickCurve(STICK_DEADZONE - 0.01)).toBe(0);
    expect(stickCurve(0)).toBe(0);
  });

  it('stick symmetric', () => {
    expect(stickCurve(-1)).toBeCloseTo(-1);
    expect(stickCurve(1)).toBeCloseTo(1);
  });

  it('curve is quadratic-ish', () => {
    const half = stickCurve(0.5);
    const one = stickCurve(1);
    expect(half / one).toBeLessThan(0.5);
  });
});
