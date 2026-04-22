import { describe, it, expect } from 'vitest';
import { findRespawnPoint, isSafeStand, type RespawnLookup } from './respawn_search';

function make(solidAt: Set<string>, dangerAt = new Set<string>()): RespawnLookup {
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  return {
    isSolid: (x, y, z) => solidAt.has(key(x, y, z)),
    isAir: (x, y, z) => !solidAt.has(key(x, y, z)),
    isDangerous: (x, y, z) => dangerAt.has(key(x, y, z)),
  };
}

describe('respawn search', () => {
  it('anchor is safe when column is valid', () => {
    const l = make(new Set(['0,-1,0']));
    expect(isSafeStand({ x: 0, y: 0, z: 0 }, l)).toBe(true);
    const p = findRespawnPoint({ anchor: { x: 0, y: 0, z: 0 }, lookup: l, searchRadius: 2 });
    expect(p).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('rejects no floor', () => {
    const l = make(new Set());
    expect(isSafeStand({ x: 0, y: 0, z: 0 }, l)).toBe(false);
  });

  it('rejects lava below', () => {
    const l = make(new Set(['0,-1,0']), new Set(['0,-1,0']));
    expect(isSafeStand({ x: 0, y: 0, z: 0 }, l)).toBe(false);
  });

  it('falls back to neighbor when anchor unsafe', () => {
    const l = make(new Set(['1,-1,0']));
    const p = findRespawnPoint({ anchor: { x: 0, y: 0, z: 0 }, lookup: l, searchRadius: 2 });
    expect(p).toEqual({ x: 1, y: 0, z: 0 });
  });

  it('returns null when search space is empty', () => {
    const l = make(new Set());
    expect(
      findRespawnPoint({ anchor: { x: 0, y: 0, z: 0 }, lookup: l, searchRadius: 3 }),
    ).toBeNull();
  });

  it('rejects obstructed head space', () => {
    const l = make(new Set(['0,-1,0', '0,1,0']));
    expect(isSafeStand({ x: 0, y: 0, z: 0 }, l)).toBe(false);
  });
});
