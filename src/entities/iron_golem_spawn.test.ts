import { describe, it, expect } from 'vitest';
import { detectIronGolemConstruct, makeGolemSpawnState, tickGolemSpawn } from './iron_golem_spawn';

function villagers(
  n: number,
): { position: { x: number; y: number; z: number }; isWorking: boolean }[] {
  return Array.from({ length: n }, (_, i) => ({
    position: { x: i, y: 0, z: 0 },
    isWorking: true,
  }));
}

describe('iron golem spawn', () => {
  it('spawns after threat timer when quorum met', () => {
    const state = makeGolemSpawnState();
    let spawned = false;
    for (let i = 0; i < 100; i++) {
      if (
        tickGolemSpawn(state, {
          villagers: villagers(10),
          bedCount: 20,
          underThreat: true,
          existingGolems: 0,
          dtSec: 1,
          rng: () => 0.01,
        }).shouldSpawn
      ) {
        spawned = true;
      }
    }
    expect(spawned).toBe(true);
  });

  it('low villager count prevents spawn', () => {
    const state = makeGolemSpawnState();
    const r = tickGolemSpawn(state, {
      villagers: villagers(3),
      bedCount: 20,
      underThreat: true,
      existingGolems: 0,
      dtSec: 120,
      rng: () => 0,
    });
    expect(r.shouldSpawn).toBe(false);
  });

  it('safe village resets timer', () => {
    const state = makeGolemSpawnState();
    tickGolemSpawn(state, {
      villagers: villagers(10),
      bedCount: 20,
      underThreat: true,
      existingGolems: 0,
      dtSec: 30,
      rng: () => 1,
    });
    tickGolemSpawn(state, {
      villagers: villagers(10),
      bedCount: 20,
      underThreat: false,
      existingGolems: 0,
      dtSec: 1,
      rng: () => 0,
    });
    expect(state.threatTimerSec).toBe(0);
  });

  it('detects valid construct', () => {
    const grid = new Map<string, string>();
    const key = (x: number, y: number, z: number): string =>
      `${x.toString()},${y.toString()},${z.toString()}`;
    grid.set(key(0, 0, 0), 'webmc:iron_block');
    grid.set(key(0, 1, 0), 'webmc:iron_block');
    grid.set(key(1, 2, 0), 'webmc:iron_block');
    grid.set(key(0, 3, 0), 'webmc:carved_pumpkin');
    expect(
      detectIronGolemConstruct(
        { x: 0, y: 0, z: 0 },
        { blockName: (x, y, z) => grid.get(key(x, y, z)) ?? 'webmc:air' },
      ),
    ).toBe(true);
  });
});
