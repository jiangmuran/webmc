import { describe, it, expect } from 'vitest';
import {
  MOON_SIZE_UNITS,
  moonBrightness,
  moonPhaseIndex,
  moonPosition,
  SUN_SIZE_UNITS,
  sunPosition,
} from './sun_moon';

describe('sun + moon', () => {
  it('sun at noon is above', () => {
    const p = sunPosition(0.25);
    expect(p[1]).toBeGreaterThan(p[0]);
  });

  it('moon opposite sun', () => {
    const sun = sunPosition(0.25);
    const moon = moonPosition(0.25);
    expect(Math.sign(moon[0])).not.toBe(Math.sign(sun[0]));
  });

  it('moon phases wrap', () => {
    expect(moonPhaseIndex(0)).toBe(0);
    expect(moonPhaseIndex(8)).toBe(0);
    expect(moonPhaseIndex(4)).toBe(4);
    expect(moonPhaseIndex(-1)).toBe(7);
  });

  it('full moon is brightest', () => {
    expect(moonBrightness(0)).toBe(1);
  });

  it('new moon dark', () => {
    expect(moonBrightness(4)).toBe(0);
  });

  it('sun is larger than moon', () => {
    expect(SUN_SIZE_UNITS).toBeGreaterThan(MOON_SIZE_UNITS);
  });
});
