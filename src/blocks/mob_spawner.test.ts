import { describe, it, expect } from 'vitest';
import { makeMobSpawner, tickSpawner } from './mob_spawner';

describe('mob spawner', () => {
  it('no player → no spawn', () => {
    const s = makeMobSpawner('zombie');
    expect(
      tickSpawner(s, {
        hasPlayerInRange: false,
        nearbySameKind: 0,
        dtSec: 30,
        rng: () => 0,
      }).spawn,
    ).toBe(0);
  });

  it('spawns mobs after timer + with player in range', () => {
    const s = makeMobSpawner('zombie');
    const r = tickSpawner(s, {
      hasPlayerInRange: true,
      nearbySameKind: 0,
      dtSec: 30,
      rng: () => 0.5,
    });
    expect(r.spawn).toBeGreaterThan(0);
  });

  it('respects nearby mob cap', () => {
    const s = makeMobSpawner('zombie');
    const r = tickSpawner(s, {
      hasPlayerInRange: true,
      nearbySameKind: 6,
      dtSec: 30,
      rng: () => 0.5,
    });
    expect(r.spawn).toBe(0);
  });

  it('timer reset after spawn', () => {
    const s = makeMobSpawner('zombie');
    tickSpawner(s, {
      hasPlayerInRange: true,
      nearbySameKind: 0,
      dtSec: 30,
      rng: () => 0.5,
    });
    expect(s.timerSec).toBeGreaterThan(0);
  });
});
