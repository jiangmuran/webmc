import { describe, it, expect } from 'vitest';
import {
  shouldIgnite,
  shouldAbort,
  readyToExplode,
  MAX_FUSE_TICKS,
} from './creeper_catching_distance';

describe('creeper catching distance', () => {
  it('ignites close with LOS', () => {
    expect(shouldIgnite({ distanceToTarget: 2, fuseTicks: 0, lineOfSight: true })).toBe(true);
  });

  it('no LOS no ignite', () => {
    expect(shouldIgnite({ distanceToTarget: 2, fuseTicks: 0, lineOfSight: false })).toBe(false);
  });

  it('aborts beyond 7-block cancel range (wiki)', () => {
    // Just outside 7-block cancel range
    expect(shouldAbort({ distanceToTarget: 8, fuseTicks: 10, lineOfSight: true })).toBe(true);
    // Within cancel range (between ignite=3 and cancel=7) — does NOT abort
    expect(shouldAbort({ distanceToTarget: 5, fuseTicks: 10, lineOfSight: true })).toBe(false);
  });

  it('explodes at max fuse', () => {
    expect(
      readyToExplode({ distanceToTarget: 0, fuseTicks: MAX_FUSE_TICKS, lineOfSight: true }),
    ).toBe(true);
  });
});
