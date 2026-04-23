import { describe, it, expect } from 'vitest';
import { respawnPosition, consumesCharge } from './respawn_anchor_location';

describe('respawn anchor location', () => {
  const fallback = { bed: { x: 5, y: 64, z: 5 }, worldSpawn: { x: 0, y: 64, z: 0 } };

  it('anchor in nether wins', () => {
    expect(
      respawnPosition({ x: 1, y: 2, z: 3, charges: 4, dimension: 'nether' }, fallback),
    ).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('no charge falls back to bed', () => {
    expect(
      respawnPosition({ x: 1, y: 2, z: 3, charges: 0, dimension: 'nether' }, fallback),
    ).toEqual(fallback.bed);
  });

  it('no bed falls to world spawn', () => {
    expect(
      respawnPosition(undefined, { worldSpawn: { x: 0, y: 64, z: 0 } }),
    ).toEqual({ x: 0, y: 64, z: 0 });
  });

  it('only nether anchor consumes charge', () => {
    expect(consumesCharge({ x: 0, y: 0, z: 0, charges: 1, dimension: 'nether' })).toBe(true);
    expect(consumesCharge({ x: 0, y: 0, z: 0, charges: 1, dimension: 'overworld' })).toBe(false);
  });
});
