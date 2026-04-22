import { describe, it, expect } from 'vitest';
import { findNearestPortal, translateCoords } from './portal_linking';

describe('portal linking', () => {
  it('overworld (800, 64, 0) → nether (100, 64, 0)', () => {
    expect(translateCoords('overworld', 'nether', { x: 800, y: 64, z: 0 })).toEqual({
      x: 100,
      y: 64,
      z: 0,
    });
  });

  it('nether (100, 64, 0) → overworld (800, 64, 0)', () => {
    expect(translateCoords('nether', 'overworld', { x: 100, y: 64, z: 0 })).toEqual({
      x: 800,
      y: 64,
      z: 0,
    });
  });

  it('finds nearest portal within radius', () => {
    const portals = [
      { pos: { x: 0, y: 64, z: 0 }, dimension: 'nether' as const },
      { pos: { x: 50, y: 64, z: 0 }, dimension: 'nether' as const },
    ];
    const best = findNearestPortal({ x: 5, y: 64, z: 0 }, portals, 'nether', 128);
    expect(best?.pos.x).toBe(0);
  });

  it('ignores other dimensions', () => {
    const portals = [{ pos: { x: 0, y: 64, z: 0 }, dimension: 'overworld' as const }];
    expect(findNearestPortal({ x: 0, y: 64, z: 0 }, portals, 'nether', 128)).toBeNull();
  });

  it('returns null when outside radius', () => {
    const portals = [{ pos: { x: 1000, y: 64, z: 0 }, dimension: 'nether' as const }];
    expect(findNearestPortal({ x: 0, y: 64, z: 0 }, portals, 'nether', 128)).toBeNull();
  });
});
