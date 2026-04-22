import { describe, it, expect } from 'vitest';
import { makeSpawner, activate, tickSpawn, onMobDeath, MAX_MOBS } from './trial_chamber_spawner';

describe('trial spawner', () => {
  it('activates with players', () => {
    const s = makeSpawner();
    expect(activate(s, { playersInRange: 1 }, () => 0)).toBe(true);
    expect(s.phase).toBe('active');
  });

  it('no players = no activate', () => {
    const s = makeSpawner();
    expect(activate(s, { playersInRange: 0 }, () => 0)).toBe(false);
  });

  it('tick spawns until target', () => {
    const s = makeSpawner();
    activate(s, { playersInRange: 1 }, () => 0);
    let spawned = 0;
    for (let i = 0; i < 20; i++) {
      if (tickSpawn(s).spawn) spawned += 1;
    }
    expect(spawned).toBe(s.targetWaveCount);
  });

  it('death triggers reward', () => {
    const s = makeSpawner();
    activate(s, { playersInRange: 1 }, () => 0);
    while (tickSpawn(s).spawn) void 0;
    let lastKeys = 0;
    while (s.mobsAlive > 0) {
      lastKeys = onMobDeath(s).keysOnClear;
    }
    expect(lastKeys).toBeGreaterThan(0);
    expect(s.phase).toBe('ejecting_rewards');
  });

  it('capped mobs alive', () => {
    const s = makeSpawner();
    activate(s, { playersInRange: 5 }, () => 0); // large target
    for (let i = 0; i < 50; i++) tickSpawn(s);
    expect(s.mobsAlive).toBeLessThanOrEqual(MAX_MOBS);
  });
});
