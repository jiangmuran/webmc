import { describe, it, expect } from 'vitest';
import { canSpawn, isHostile } from './mob_spawn_rules';

describe('mob spawn rules', () => {
  it('peaceful blocks hostile', () => {
    expect(
      canSpawn({
        mob: 'zombie',
        skyLight: 0,
        blockLight: 0,
        biome: 'plains',
        difficulty: 'peaceful',
        hasSolidBelow: true,
      }),
    ).toBe(false);
  });

  it('zombie in dark spawns', () => {
    expect(
      canSpawn({
        mob: 'zombie',
        skyLight: 0,
        blockLight: 0,
        biome: 'plains',
        difficulty: 'normal',
        hasSolidBelow: true,
      }),
    ).toBe(true);
  });

  it('cow in bright spawns', () => {
    expect(
      canSpawn({
        mob: 'cow',
        skyLight: 15,
        blockLight: 0,
        biome: 'plains',
        difficulty: 'normal',
        hasSolidBelow: true,
      }),
    ).toBe(true);
  });

  it('no solid → never', () => {
    expect(
      canSpawn({
        mob: 'cow',
        skyLight: 15,
        blockLight: 0,
        biome: 'plains',
        difficulty: 'normal',
        hasSolidBelow: false,
      }),
    ).toBe(false);
  });

  it('hostility check', () => {
    expect(isHostile('zombie')).toBe(true);
    expect(isHostile('pig')).toBe(false);
  });
});
