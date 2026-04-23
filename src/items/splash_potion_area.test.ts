import { describe, it, expect } from 'vitest';
import {
  intensityScale,
  appliedDurationTicks,
  hasAnyEffect,
  directHitFullEffect,
  SPLASH_RADIUS,
} from './splash_potion_area';

describe('splash potion area', () => {
  it('center full intensity', () => {
    expect(intensityScale(0)).toBe(1);
  });

  it('edge zero', () => {
    expect(intensityScale(SPLASH_RADIUS)).toBe(0);
  });

  it('linear midway', () => {
    expect(intensityScale(2)).toBeCloseTo(0.5);
  });

  it('duration scaled', () => {
    expect(appliedDurationTicks(800, 2)).toBe(400);
  });

  it('no effect beyond radius', () => {
    expect(hasAnyEffect(10)).toBe(false);
  });

  it('direct hit 100%', () => {
    expect(directHitFullEffect()).toBe(1);
  });
});
