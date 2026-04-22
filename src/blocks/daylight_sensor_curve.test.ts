import { describe, it, expect } from 'vitest';
import { signalFromSkyBrightness, skyBrightness, canToggleInverted } from './daylight_sensor_curve';

describe('daylight sensor curve', () => {
  it('noon → 15', () => {
    expect(signalFromSkyBrightness(1, false)).toBe(15);
  });

  it('midnight → 0', () => {
    expect(signalFromSkyBrightness(0, false)).toBe(0);
  });

  it('inverted flips', () => {
    expect(signalFromSkyBrightness(0, true)).toBe(15);
    expect(signalFromSkyBrightness(1, true)).toBe(0);
  });

  it('sky peaks at 6000', () => {
    expect(skyBrightness(6000)).toBeCloseTo(1);
  });

  it('sky 0 at night', () => {
    expect(skyBrightness(18000)).toBe(0);
  });

  it('can toggle', () => {
    expect(canToggleInverted()).toBe(true);
  });
});
