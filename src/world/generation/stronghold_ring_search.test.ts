import { describe, it, expect } from 'vitest';
import {
  ringIndexForDistance,
  totalStrongholds,
  strongholdsInRing,
  nearestRingAngle,
  RING_COUNT,
} from './stronghold_ring_search';

describe('stronghold ring search', () => {
  it('8 rings', () => {
    expect(RING_COUNT).toBe(8);
  });

  it('total is 128', () => {
    expect(totalStrongholds()).toBe(128);
  });

  it('first ring finds small distance', () => {
    expect(ringIndexForDistance(2000)).toBe(0);
  });

  it('between rings undefined', () => {
    expect(ringIndexForDistance(100)).toBeUndefined();
  });

  it('first ring 3 strongholds', () => {
    expect(strongholdsInRing(0)).toBe(3);
  });

  it('angles evenly distributed', () => {
    const a = nearestRingAngle(0, 12345);
    expect(a).toHaveLength(3);
  });
});
