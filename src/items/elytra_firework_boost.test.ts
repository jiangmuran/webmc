import { describe, it, expect } from 'vitest';
import { BOOST_CONSUMES_ROCKET, canBoost, fireworkBoost } from './elytra_firework_boost';

describe('firework boost', () => {
  it('boost delta aligns with look direction', () => {
    const r = fireworkBoost({
      lookForward: { x: 0, y: 0, z: 1 },
      flightDuration: 1,
      currentVelocity: { x: 0, y: 0, z: 0 },
    });
    expect(r.velocityDelta.z).toBeGreaterThan(0);
  });

  it('flight duration scales boost', () => {
    const short = fireworkBoost({
      lookForward: { x: 0, y: 0, z: 1 },
      flightDuration: 1,
      currentVelocity: { x: 0, y: 0, z: 0 },
    });
    const long = fireworkBoost({
      lookForward: { x: 0, y: 0, z: 1 },
      flightDuration: 3,
      currentVelocity: { x: 0, y: 0, z: 0 },
    });
    expect(long.velocityDelta.z).toBeGreaterThan(short.velocityDelta.z);
    expect(long.boostDurationSec).toBeGreaterThan(short.boostDurationSec);
  });

  it('current velocity contributes', () => {
    const with_vel = fireworkBoost({
      lookForward: { x: 0, y: 0, z: 0 },
      flightDuration: 1,
      currentVelocity: { x: 0, y: 0, z: 10 },
    });
    expect(with_vel.velocityDelta.z).toBeGreaterThan(0);
  });

  it('rocket consumed', () => {
    expect(BOOST_CONSUMES_ROCKET).toBe(true);
  });

  it('canBoost requires gliding', () => {
    expect(canBoost({ gliding: true, hasFireworkInHand: true })).toBe(true);
    expect(canBoost({ gliding: false, hasFireworkInHand: true })).toBe(false);
    expect(canBoost({ gliding: true, hasFireworkInHand: false })).toBe(false);
  });
});
