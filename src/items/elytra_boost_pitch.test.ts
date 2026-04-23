import { describe, it, expect } from 'vitest';
import {
  glideStep,
  startRocketBoost,
  hasRocketBoost,
  ROCKET_BOOST_SPEED,
} from './elytra_boost_pitch';

describe('elytra boost pitch', () => {
  it('diving increases speed', () => {
    const s = glideStep({ pitchRad: Math.PI / 2, speed: 0, rocketTicksRemaining: 0 });
    expect(s.speed).toBeGreaterThan(0);
  });

  it('climbing decays', () => {
    const s = glideStep({ pitchRad: -Math.PI / 2, speed: 1, rocketTicksRemaining: 0 });
    expect(s.speed).toBeLessThan(1);
  });

  it('rocket caps speed', () => {
    let c = startRocketBoost({ pitchRad: 0, speed: 0, rocketTicksRemaining: 0 }, 40);
    for (let i = 0; i < 40; i++) c = glideStep(c);
    expect(c.speed).toBeLessThanOrEqual(ROCKET_BOOST_SPEED);
  });

  it('hasRocket flag', () => {
    expect(hasRocketBoost({ pitchRad: 0, speed: 0, rocketTicksRemaining: 10 })).toBe(true);
  });
});
