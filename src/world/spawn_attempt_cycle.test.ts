import { describe, it, expect } from 'vitest';
import {
  canSpawnMonsterHere,
  canSpawnPassiveHere,
  SPAWN_PER_CHUNK_ATTEMPTS,
  HOSTILE_MAX_LIGHT,
  PASSIVE_MIN_LIGHT,
} from './spawn_attempt_cycle';

describe('spawn attempt cycle', () => {
  it('monster spawns in dark', () => {
    expect(
      canSpawnMonsterHere({
        x: 0,
        y: 0,
        z: 0,
        category: 'monster',
        skyLight: 0,
        blockLight: 0,
        onValidSurface: true,
      }),
    ).toBe(true);
  });

  it('no monster in light', () => {
    expect(
      canSpawnMonsterHere({
        x: 0,
        y: 0,
        z: 0,
        category: 'monster',
        skyLight: 10,
        blockLight: 0,
        onValidSurface: true,
      }),
    ).toBe(false);
  });

  it('passive in bright', () => {
    expect(
      canSpawnPassiveHere({
        x: 0,
        y: 0,
        z: 0,
        category: 'creature',
        skyLight: PASSIVE_MIN_LIGHT,
        blockLight: 0,
        onValidSurface: true,
      }),
    ).toBe(true);
  });

  it('no passive in cave', () => {
    expect(
      canSpawnPassiveHere({
        x: 0,
        y: 0,
        z: 0,
        category: 'creature',
        skyLight: 0,
        blockLight: 0,
        onValidSurface: true,
      }),
    ).toBe(false);
  });

  it('attempt count', () => {
    expect(SPAWN_PER_CHUNK_ATTEMPTS).toBe(3);
    expect(HOSTILE_MAX_LIGHT).toBeLessThan(PASSIVE_MIN_LIGHT);
  });
});
