import { describe, it, expect } from 'vitest';
import { canSpawnByLight, surfaceOk } from './mob_spawn_light_check';

describe('mob spawn light', () => {
  it('dark overworld spawns', () => {
    expect(
      canSpawnByLight({
        dimension: 'overworld',
        blockLight: 0,
        skyLight: 0,
        isDay: false,
        monsterCategory: 'overworld_hostile',
      }),
    ).toBe(true);
  });

  it('lit overworld blocks', () => {
    expect(
      canSpawnByLight({
        dimension: 'overworld',
        blockLight: 8,
        skyLight: 0,
        isDay: false,
        monsterCategory: 'overworld_hostile',
      }),
    ).toBe(false);
  });

  it('day skylight blocks', () => {
    expect(
      canSpawnByLight({
        dimension: 'overworld',
        blockLight: 0,
        skyLight: 15,
        isDay: true,
        monsterCategory: 'overworld_hostile',
      }),
    ).toBe(false);
  });

  it('nether ignores light', () => {
    expect(
      canSpawnByLight({
        dimension: 'nether',
        blockLight: 15,
        skyLight: 0,
        isDay: false,
        monsterCategory: 'nether_hostile',
      }),
    ).toBe(true);
  });

  it('end dimension check', () => {
    expect(
      canSpawnByLight({
        dimension: 'end',
        blockLight: 15,
        skyLight: 0,
        isDay: false,
        monsterCategory: 'end_hostile',
      }),
    ).toBe(true);
  });

  it('surface requirements', () => {
    expect(surfaceOk({ groundSolid: true, headSpaceClear: true, spawnNotInWater: true })).toBe(
      true,
    );
    expect(surfaceOk({ groundSolid: false, headSpaceClear: true, spawnNotInWater: true })).toBe(
      false,
    );
  });
});
