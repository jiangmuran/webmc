import { describe, it, expect } from 'vitest';
import {
  targetMobCount,
  shouldSpawn,
  hasGivenReward,
  SPAWN_INTERVAL_TICKS,
} from './trial_spawner_mechanics';

describe('trial spawner mechanics', () => {
  it('count scales with players (wiki: 1+nPlayers, 2/3/4 at 1/2/3)', () => {
    const base = {
      mobsAlive: 0,
      wavesSpawned: 0,
      maxWaves: 3,
      ticksSinceLastSpawn: 0,
    };
    expect(targetMobCount({ ...base, playersRegistered: 1 })).toBe(2);
    expect(targetMobCount({ ...base, playersRegistered: 2 })).toBe(3);
    expect(targetMobCount({ ...base, playersRegistered: 3 })).toBe(4);
  });

  it('spawns when empty', () => {
    expect(
      shouldSpawn({
        playersRegistered: 1,
        mobsAlive: 0,
        wavesSpawned: 0,
        maxWaves: 3,
        ticksSinceLastSpawn: SPAWN_INTERVAL_TICKS,
      }),
    ).toBe(true);
  });

  it('stops past max waves', () => {
    expect(
      shouldSpawn({
        playersRegistered: 1,
        mobsAlive: 0,
        wavesSpawned: 3,
        maxWaves: 3,
        ticksSinceLastSpawn: 99999,
      }),
    ).toBe(false);
  });

  it('reward after cleared', () => {
    expect(
      hasGivenReward({
        playersRegistered: 1,
        mobsAlive: 0,
        wavesSpawned: 3,
        maxWaves: 3,
        ticksSinceLastSpawn: 0,
      }),
    ).toBe(true);
  });
});
