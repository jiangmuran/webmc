import { describe, it, expect } from 'vitest';
import {
  waterFogColor,
  waterFogDensity,
  waterDistortionStrength,
} from './water_overlay_underwater';

describe('water overlay underwater', () => {
  it('warm ocean blue-green', () => {
    const [, g, b] = waterFogColor('warm_ocean');
    expect(g).toBeGreaterThan(0.5);
    expect(b).toBeGreaterThan(0.5);
  });

  it('swamp green-brown', () => {
    const [r, g, b] = waterFogColor('swamp');
    expect(r).toBeGreaterThan(b);
    expect(g).toBeGreaterThan(b);
  });

  it('density grows with depth', () => {
    expect(waterFogDensity(10)).toBeGreaterThan(waterFogDensity(0));
  });

  it('density capped at 1', () => {
    expect(waterFogDensity(10000)).toBeLessThanOrEqual(1);
  });

  it('distortion only underwater', () => {
    expect(waterDistortionStrength(true)).toBeGreaterThan(0);
    expect(waterDistortionStrength(false)).toBe(0);
  });
});
