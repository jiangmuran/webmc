import { describe, it, expect } from 'vitest';
import {
  sunPosition,
  moonPosition,
  brightnessFromSun,
  celestialAngleForTick,
} from './sun_moon_position';

describe('sun moon position', () => {
  it('noon sun overhead', () => {
    expect(sunPosition(6000).y).toBeCloseTo(1);
  });

  it('midnight sun below', () => {
    expect(sunPosition(18000).y).toBeCloseTo(-1);
  });

  it('moon opposite sun', () => {
    expect(moonPosition(6000).y).toBeCloseTo(-1);
    expect(moonPosition(18000).y).toBeCloseTo(1);
  });

  it('brightness max at noon', () => {
    expect(brightnessFromSun(6000)).toBeCloseTo(1);
  });

  it('brightness zero at midnight', () => {
    expect(brightnessFromSun(18000)).toBe(0);
  });

  it('angle wraps full circle', () => {
    expect(celestialAngleForTick(0)).toBeCloseTo(celestialAngleForTick(24000));
  });
});
