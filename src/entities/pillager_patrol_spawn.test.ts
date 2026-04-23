import { describe, it, expect } from 'vitest';
import {
  shouldSpawnPatrol,
  patrolSize,
  captainHasBanner,
  MIN_DISTANCE_FROM_SPAWN,
  MIN_PATROL_COOLDOWN_TICKS,
} from './pillager_patrol_spawn';

describe('pillager patrol spawn', () => {
  it('no patrol day 0', () => {
    expect(
      shouldSpawnPatrol({
        daysSinceWorldStart: 0,
        distanceFromSpawn: 100,
        ticksSinceLastPatrol: 1e6,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('no patrol near spawn', () => {
    expect(
      shouldSpawnPatrol({
        daysSinceWorldStart: 5,
        distanceFromSpawn: MIN_DISTANCE_FROM_SPAWN - 1,
        ticksSinceLastPatrol: 1e6,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('spawns after conditions', () => {
    expect(
      shouldSpawnPatrol({
        daysSinceWorldStart: 5,
        distanceFromSpawn: 100,
        ticksSinceLastPatrol: MIN_PATROL_COOLDOWN_TICKS,
        rand: () => 0,
      }),
    ).toBe(true);
  });

  it('patrol size by difficulty', () => {
    expect(patrolSize('hard')).toBeGreaterThan(patrolSize('easy'));
  });

  it('captain banner', () => {
    expect(captainHasBanner()).toBe(true);
  });
});
