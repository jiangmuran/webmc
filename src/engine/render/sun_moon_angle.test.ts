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
    expect(sunAngle(0)).toBeCloseTo(sunAngle(24000));
    expect(sunAngle(6000)).toBeCloseTo(Math.PI / 2);
  });
});
