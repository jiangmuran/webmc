import { describe, it, expect } from 'vitest';
import {
  makeSpawner,
  tickSpawner,
  brokenXp,
  DEFAULT_SPAWN_DELAY,
  MAX_NEARBY,
  SPAWNER_XP_RANGE,
} from './spawner_cage_mob';

describe('mob spawner', () => {
  it('no player = no spawn', () => {
    const s = makeSpawner('zombie');
    const r = tickSpawner(s, {
      playerInRange: false,
      nearbyMobsOfType: 0,
      nowTick: 1000,
      lastSpawnTick: 0,
      rand: () => 0,
    });
    expect(r.mobsToSpawn).toBe(0);
  });

  it('respects max nearby', () => {
    const s = makeSpawner('zombie');
    const r = tickSpawner(s, {
      playerInRange: true,
      nearbyMobsOfType: MAX_NEARBY,
      nowTick: 1000,
      lastSpawnTick: 0,
      rand: () => 0,
    });
    expect(r.mobsToSpawn).toBe(0);
  });

  it('cooldown respected', () => {
    const s = makeSpawner('zombie');
    const r = tickSpawner(s, {
      playerInRange: true,
      nearbyMobsOfType: 0,
      nowTick: 50,
      lastSpawnTick: 0,
      rand: () => 0,
    });
    expect(r.mobsToSpawn).toBe(0);
  });

  it('spawns 0..4', () => {
    const s = makeSpawner('zombie');
    const r = tickSpawner(s, {
      playerInRange: true,
      nearbyMobsOfType: 0,
      nowTick: DEFAULT_SPAWN_DELAY + 1,
      lastSpawnTick: 0,
      rand: () => 0,
    });
    expect(r.mobsToSpawn).toBe(4);
  });

  it('xp range', () => {
    for (let i = 0; i < 20; i++) {
      const xp = brokenXp(() => i / 20);
      expect(xp).toBeGreaterThanOrEqual(SPAWNER_XP_RANGE.min);
      expect(xp).toBeLessThanOrEqual(SPAWNER_XP_RANGE.max);
    }
  });
});
