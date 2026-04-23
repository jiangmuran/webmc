import { describe, it, expect } from 'vitest';
import { liftFromPitch, withBoost, isGliding } from './elytra_swim_boost';

describe('elytra swim boost', () => {
  it('looking up gives lift', () => {
    expect(
      liftFromPitch({ pitchRad: -Math.PI / 4, velocity: { vx: 0, vy: 0, vz: 0 }, rocketBoost: 0 }),
    ).toBeGreaterThan(0);
  });

  it('looking down zero', () => {
    expect(
      liftFromPitch({ pitchRad: Math.PI / 4, velocity: { vx: 0, vy: 0, vz: 0 }, rocketBoost: 0 }),
    ).toBe(0);
  });

  it('boost scales', () => {
    expect(withBoost(1, 3)).toBeGreaterThan(withBoost(1, 0));
  });

  it('glide detection', () => {
    expect(isGliding({ pitchRad: 0, velocity: { vx: 1, vy: 0, vz: 0 }, rocketBoost: 0 })).toBe(
      true,
    );
    expect(isGliding({ pitchRad: 0, velocity: { vx: 0, vy: 0, vz: 0 }, rocketBoost: 0 })).toBe(
      false,
    );
  });
});
