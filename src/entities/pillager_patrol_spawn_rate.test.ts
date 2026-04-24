import { describe, it, expect } from 'vitest';
import {
  canSpawnPatrol,
  patrolSize,
  captainChance,
  MIN_DAYS_BEFORE_PATROLS,
  PATROL_INTERVAL_MS,
} from './pillager_patrol_spawn_rate';

describe('pillager patrol spawn rate', () => {
  it('too young world no patrols', () => {
    expect(
      canSpawnPatrol({
        daysAlive: 1,
        lastPatrolMs: 0,
        nowMs: 9999999,
        playerOutsideVillage: true,
        rng: () => 0.01,
      }),
    ).toBe(false);
  });

  it('inside village no patrols', () => {
    expect(
      canSpawnPatrol({
        daysAlive: MIN_DAYS_BEFORE_PATROLS,
        lastPatrolMs: 0,
        nowMs: PATROL_INTERVAL_MS,
        playerOutsideVillage: false,
        rng: () => 0.01,
      }),
    ).toBe(false);
  });

  it('outside village + lucky spawns', () => {
    expect(
      canSpawnPatrol({
        daysAlive: MIN_DAYS_BEFORE_PATROLS,
        lastPatrolMs: 0,
        nowMs: PATROL_INTERVAL_MS,
        playerOutsideVillage: true,
        rng: () => 0.01,
      }),
    ).toBe(true);
  });

  it('unlucky no spawn', () => {
    expect(
      canSpawnPatrol({
        daysAlive: MIN_DAYS_BEFORE_PATROLS,
        lastPatrolMs: 0,
        nowMs: PATROL_INTERVAL_MS,
        playerOutsideVillage: true,
        rng: () => 0.9,
      }),
    ).toBe(false);
  });

  it('patrol size 2-5', () => {
    const s = patrolSize(() => 0.5);
    expect(s).toBeGreaterThanOrEqual(2);
    expect(s).toBeLessThanOrEqual(5);
  });

  it('captain always present', () => {
    expect(captainChance()).toBe(1);
  });
});
