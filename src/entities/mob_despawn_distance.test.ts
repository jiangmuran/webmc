import { describe, it, expect } from 'vitest';
import {
  forcedToDespawn,
  chanceOfSoftDespawn,
  INSTANT_DESPAWN_DISTANCE,
  SOFT_DESPAWN_DISTANCE,
  MIN_AGE_TO_DESPAWN,
} from './mob_despawn_distance';

describe('mob despawn distance', () => {
  it('far mob despawns', () => {
    expect(
      forcedToDespawn({
        distanceToNearestPlayer: INSTANT_DESPAWN_DISTANCE,
        ageTicks: 0,
        isPersistent: false,
        hasCustomName: false,
      }),
    ).toBe(true);
  });

  it('named mob survives', () => {
    expect(
      forcedToDespawn({
        distanceToNearestPlayer: INSTANT_DESPAWN_DISTANCE + 100,
        ageTicks: 10000,
        isPersistent: false,
        hasCustomName: true,
      }),
    ).toBe(false);
  });

  it('soft despawn chance zero when young', () => {
    expect(
      chanceOfSoftDespawn({
        distanceToNearestPlayer: 100,
        ageTicks: 10,
        isPersistent: false,
        hasCustomName: false,
      }),
    ).toBe(0);
  });

  it('soft despawn zero when close', () => {
    expect(
      chanceOfSoftDespawn({
        distanceToNearestPlayer: SOFT_DESPAWN_DISTANCE,
        ageTicks: MIN_AGE_TO_DESPAWN,
        isPersistent: false,
        hasCustomName: false,
      }),
    ).toBe(0);
  });

  it('soft despawn chance when far + old', () => {
    expect(
      chanceOfSoftDespawn({
        distanceToNearestPlayer: 100,
        ageTicks: MIN_AGE_TO_DESPAWN + 10,
        isPersistent: false,
        hasCustomName: false,
      }),
    ).toBeGreaterThan(0);
  });
});
