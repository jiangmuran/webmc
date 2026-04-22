import { describe, it, expect } from 'vitest';
import {
  activateSpawner,
  makeSpawner,
  makeVault,
  tickSpawner,
  tryOpenVault,
} from './trial_chamber';

describe('trial spawner', () => {
  it('starts dormant', () => {
    const s = makeSpawner();
    expect(s.status).toBe('dormant');
  });

  it('activates and scales mob count with player count', () => {
    const s = makeSpawner();
    activateSpawner(s, 3);
    expect(s.status).toBe('active');
    expect(s.maxMobs).toBe(18);
  });

  it('ominous adds bonus per player', () => {
    const s = makeSpawner(true);
    activateSpawner(s, 2);
    expect(s.maxMobs).toBeGreaterThan(12);
  });

  it('ends after max mobs spawned and cleared', () => {
    const s = makeSpawner();
    activateSpawner(s, 1);
    // Spawn up to max.
    for (let i = 0; i < s.maxMobs; i++) {
      tickSpawner(s, { canSpawn: () => true, dtSec: 0.1 });
      s.activeMobsAlive = 0; // caller killed the mob immediately
    }
    const ended = tickSpawner(s, { canSpawn: () => true, dtSec: 0.1 });
    expect(ended.shouldEject).toBe(true);
    expect(s.status).toBe('ejecting');
  });

  it('transitions ejecting → cooldown → dormant', () => {
    const s = makeSpawner();
    s.status = 'ejecting';
    tickSpawner(s, { canSpawn: () => false, dtSec: 0 });
    expect(s.status).toBe('cooldown');
    s.cooldownSec = 0.01;
    tickSpawner(s, { canSpawn: () => false, dtSec: 1 });
    expect(s.status).toBe('dormant');
  });
});

describe('vault', () => {
  it('accepts the right key from a fresh player', () => {
    const v = makeVault(false);
    const r = tryOpenVault(v, { keyName: 'webmc:trial_key', playerId: 'alice' });
    expect(r.accepted).toBe(true);
  });

  it('refuses a second claim from the same player', () => {
    const v = makeVault(false);
    tryOpenVault(v, { keyName: 'webmc:trial_key', playerId: 'alice' });
    const r = tryOpenVault(v, { keyName: 'webmc:trial_key', playerId: 'alice' });
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe('already_claimed');
  });

  it('accepts separate players', () => {
    const v = makeVault(false);
    tryOpenVault(v, { keyName: 'webmc:trial_key', playerId: 'alice' });
    const r = tryOpenVault(v, { keyName: 'webmc:trial_key', playerId: 'bob' });
    expect(r.accepted).toBe(true);
  });

  it('ominous vault requires ominous key', () => {
    const v = makeVault(true);
    const wrong = tryOpenVault(v, { keyName: 'webmc:trial_key', playerId: 'alice' });
    expect(wrong.accepted).toBe(false);
    const right = tryOpenVault(v, { keyName: 'webmc:ominous_trial_key', playerId: 'alice' });
    expect(right.accepted).toBe(true);
  });
});
