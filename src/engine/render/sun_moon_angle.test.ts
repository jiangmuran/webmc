import { describe, it, expect } from 'vitest';
import { sunAngle, moonAngle, sunAboveHorizon } from './sun_moon_angle';

describe('sun moon angle', () => {
  it('sun up at noon', () => {
    expect(sunAboveHorizon(6000)).toBe(true);
  });

  it('sun down at midnight', () => {
    expect(sunAboveHorizon(18000)).toBe(false);
  });

  it('moon opposite sun', () => {
    expect(Math.abs(moonAngle(0) - sunAngle(0) - Math.PI)).toBeCloseTo(0);
  });

  it('cycles over 24000', () => {
    const a = sunAngle(0);
    const b = sunAngle(24000);
    expect(b - a).toBeCloseTo(2 * Math.PI);
  });
});
