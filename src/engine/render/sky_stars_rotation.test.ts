import { describe, it, expect } from 'vitest';
import { starAlphaForTime, skyAngleForTime } from './sky_stars_rotation';

describe('sky stars rotation', () => {
  it('no stars in day', () => {
    expect(starAlphaForTime(6000)).toBe(0);
  });

  it('stars peak at midnight', () => {
    expect(starAlphaForTime(18000)).toBe(1);
  });

  it('dusk fades in', () => {
    expect(starAlphaForTime(15000)).toBeGreaterThan(0);
    expect(starAlphaForTime(15000)).toBeLessThan(1);
  });

  it('sky angle cycles', () => {
    expect(skyAngleForTime(0)).toBe(0);
    expect(skyAngleForTime(12000)).toBeCloseTo(Math.PI);
  });
});
