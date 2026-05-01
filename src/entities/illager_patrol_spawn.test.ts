import { describe, it, expect } from 'vitest';
import {
  shouldSpawnPatrol,
  patrolSize,
  MIN_DAY_FOR_PATROL,
  MIN_TICKS_BETWEEN,
} from './illager_patrol_spawn';

describe('illager patrol spawn', () => {
  it('too early in world', () => {
    expect(
      shouldSpawnPatrol(
        { dayCount: 1, playerTicksSinceLastPatrol: MIN_TICKS_BETWEEN, nearbyPatrolCount: 0 },
        () => 0,
      ),
    ).toBe(false);
  });

  it('already patrol nearby', () => {
    expect(
      shouldSpawnPatrol(
        {
          dayCount: MIN_DAY_FOR_PATROL,
          playerTicksSinceLastPatrol: MIN_TICKS_BETWEEN,
          nearbyPatrolCount: 1,
        },
        () => 0,
      ),
    ).toBe(false);
  });

  it('lucky spawn', () => {
    expect(
      shouldSpawnPatrol(
        {
          dayCount: MIN_DAY_FOR_PATROL,
          playerTicksSinceLastPatrol: MIN_TICKS_BETWEEN,
          nearbyPatrolCount: 0,
        },
        () => 0,
      ),
    ).toBe(true);
  });

  it('patrol size is 1-5 random per wiki', () => {
    // minecraft.wiki/w/Patrol#Spawning: 1-5 pillagers in Java.
    expect(patrolSize(() => 0)).toBe(1);
    expect(patrolSize(() => 0.5)).toBe(3);
    expect(patrolSize(() => 0.99)).toBe(5);
  });
});
