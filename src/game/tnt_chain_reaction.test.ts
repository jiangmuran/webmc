import { describe, it, expect } from 'vitest';
import {
  shouldIgniteNearbyTnt,
  shortFuseTicks,
  launchedByBlast,
  ADJACENT_FUSE_MIN,
  ADJACENT_FUSE_MAX,
} from './tnt_chain_reaction';

describe('tnt chain reaction', () => {
  it('nearby ignites', () => {
    expect(shouldIgniteNearbyTnt({ detonationPower: 4, distance: 3 })).toBe(true);
  });

  it('far doesnt ignite', () => {
    expect(shouldIgniteNearbyTnt({ detonationPower: 4, distance: 20 })).toBe(false);
  });

  it('short fuse in range', () => {
    for (let i = 0; i < 50; i++) {
      const t = shortFuseTicks(Math.random);
      expect(t).toBeGreaterThanOrEqual(ADJACENT_FUSE_MIN);
      expect(t).toBeLessThanOrEqual(ADJACENT_FUSE_MAX);
    }
  });

  it('launch velocity up', () => {
    expect(launchedByBlast(1, 4).vy).toBeGreaterThan(0);
  });

  it('far no launch', () => {
    expect(launchedByBlast(100, 4).vy).toBe(0);
  });
});
