import { describe, it, expect } from 'vitest';
import {
  isSafeSpawn,
  searchRespawnSpot,
  bedObstructedError,
  RESPAWN_SEARCH_RADIUS,
  type Cell,
} from './bed_obstructed';

const safe: Cell = { x: 0, y: 0, z: 0, solidBelow: true, airAt: true, airAbove: true };
const unsafe: Cell = { x: 0, y: 0, z: 0, solidBelow: false, airAt: true, airAbove: true };

describe('bed obstructed', () => {
  it('safe checks', () => {
    expect(isSafeSpawn(safe)).toBe(true);
    expect(isSafeSpawn(unsafe)).toBe(false);
  });

  it('search prefers safe', () => {
    expect(searchRespawnSpot([unsafe, safe])).toBe(safe);
  });

  it('no safe returns null', () => {
    expect(searchRespawnSpot([unsafe])).toBeNull();
  });

  it('radius > 0', () => {
    expect(RESPAWN_SEARCH_RADIUS).toBeGreaterThan(0);
  });

  it('error message', () => {
    expect(bedObstructedError()).toContain('obstructed');
  });
});
