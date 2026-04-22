import { describe, it, expect } from 'vitest';
import {
  sunAngleRadians,
  moonAngleRadians,
  clockFrameIndex,
  isDay,
  DAY_TICKS,
  CLOCK_FRAMES,
} from './clock_sun_position';

describe('clock', () => {
  it('dawn = 0', () => {
    expect(sunAngleRadians(0)).toBe(0);
  });

  it('noon = π/2', () => {
    expect(sunAngleRadians(DAY_TICKS / 4)).toBeCloseTo(Math.PI / 2);
  });

  it('moon is opposite', () => {
    const m = moonAngleRadians(0);
    const s = sunAngleRadians(0);
    expect(m - s).toBeCloseTo(Math.PI);
  });

  it('day/night split', () => {
    expect(isDay(1000)).toBe(true);
    expect(isDay(13000)).toBe(false);
  });

  it('frame wraps', () => {
    expect(clockFrameIndex(DAY_TICKS)).toBe(0);
    expect(clockFrameIndex(0)).toBe(0);
    expect(clockFrameIndex(DAY_TICKS / 2)).toBe(CLOCK_FRAMES / 2);
  });
});
