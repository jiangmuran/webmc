import { describe, it, expect } from 'vitest';
import {
  flightTicks,
  maxFlightTicks,
  elytraBoostSpeed,
  directHitDamage,
  crossbowFireworkSupport,
} from './firework_flight_duration';

describe('firework flight duration', () => {
  it('tier 1', () => {
    expect(flightTicks(1)).toBe(30);
  });

  it('tier 3 longest', () => {
    expect(flightTicks(3)).toBe(maxFlightTicks());
  });

  it('elytra boost scales', () => {
    expect(elytraBoostSpeed(1)).toBeLessThan(elytraBoostSpeed(3));
  });

  it('direct hit adds per star', () => {
    expect(directHitDamage(1, 2)).toBeGreaterThan(directHitDamage(1, 1));
  });

  it('crossbow supports fireworks', () => {
    expect(crossbowFireworkSupport()).toBe(true);
  });
});
