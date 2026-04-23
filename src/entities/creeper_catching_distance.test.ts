import { describe, it, expect } from 'vitest';
import {
  shouldIgnite,
  shouldAbort,
  readyToExplode,
  IGNITE_RANGE,
  MAX_FUSE_TICKS,
} from './creeper_catching_distance';

describe('creeper catching distance', () => {
  it('ignites close with LOS', () => {
    expect(shouldIgnite({ distanceToTarget: 2, fuseTicks: 0, lineOfSight: true })).toBe(true);
  });

  it('no LOS no ignite', () => {
    expect(shouldIgnite({ distanceToTarget: 2, fuseTicks: 0, lineOfSight: false })).toBe(false);
  });

  it('aborts when out of range', () => {
    expect(shouldAbort({ distanceToTarget: IGNITE_RANGE * 3, fuseTicks: 10, lineOfSight: true })).toBe(
      true,
    );
  });

  it('explodes at max fuse', () => {
    expect(readyToExplode({ distanceToTarget: 0, fuseTicks: MAX_FUSE_TICKS, lineOfSight: true })).toBe(
      true,
    );
  });
});
