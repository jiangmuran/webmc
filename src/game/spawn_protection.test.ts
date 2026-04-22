import { describe, it, expect } from 'vitest';
import {
  canHostileSpawnAt,
  defaultConfig,
  isProtected,
  isSpawnChunk,
  MOBSPAWN_SAFE_RADIUS,
  SPAWN_CHUNK_RADIUS,
} from './spawn_protection';

describe('spawn protection', () => {
  it('default radius 16', () => {
    expect(defaultConfig().radius).toBe(16);
  });

  it('blocks non-op at spawn', () => {
    expect(
      isProtected({
        worldSpawn: { x: 0, z: 0 },
        action: { x: 5, z: 5 },
        playerOpLevel: 0,
        config: defaultConfig(),
      }),
    ).toBe(true);
  });

  it('op bypasses', () => {
    expect(
      isProtected({
        worldSpawn: { x: 0, z: 0 },
        action: { x: 5, z: 5 },
        playerOpLevel: 4,
        config: defaultConfig(),
      }),
    ).toBe(false);
  });

  it('far action not protected', () => {
    expect(
      isProtected({
        worldSpawn: { x: 0, z: 0 },
        action: { x: 100, z: 100 },
        playerOpLevel: 0,
        config: defaultConfig(),
      }),
    ).toBe(false);
  });

  it('zero radius disables', () => {
    expect(
      isProtected({
        worldSpawn: { x: 0, z: 0 },
        action: { x: 0, z: 0 },
        playerOpLevel: 0,
        config: { radius: 0, opLevel: 2 },
      }),
    ).toBe(false);
  });

  it('spawn chunk radius is 8', () => {
    expect(SPAWN_CHUNK_RADIUS).toBe(8);
    expect(isSpawnChunk(0, 0, 0, 0)).toBe(true);
    expect(isSpawnChunk(10, 0, 0, 0)).toBe(false);
  });

  it('hostile safe radius', () => {
    expect(MOBSPAWN_SAFE_RADIUS).toBe(24);
    expect(canHostileSpawnAt({ x: 10, z: 10 }, { x: 0, z: 0 })).toBe(false);
    expect(canHostileSpawnAt({ x: 50, z: 50 }, { x: 0, z: 0 })).toBe(true);
  });
});
