import { describe, it, expect } from 'vitest';
import {
  isMainIsland,
  isOuterIslandRegion,
  islandHeight,
  pillarPositions,
  MAIN_ISLAND_RADIUS,
  PILLAR_COUNT,
} from './end_stone_generate';

describe('end islands', () => {
  it('main island detection', () => {
    expect(isMainIsland({ x: 0, z: 0, worldSeed: 0n })).toBe(true);
    expect(isMainIsland({ x: MAIN_ISLAND_RADIUS + 1, z: 0, worldSeed: 0n })).toBe(false);
  });

  it('outer region gap', () => {
    expect(isOuterIslandRegion({ x: 200, z: 0, worldSeed: 0n })).toBe(false);
  });

  it('main island height', () => {
    expect(islandHeight({ x: 0, z: 0, worldSeed: 0n })).toBeGreaterThan(40);
  });

  it('gap returns null', () => {
    expect(islandHeight({ x: 500, z: 0, worldSeed: 0n })).toBeNull();
  });

  it('pillars 10 count', () => {
    expect(pillarPositions().length).toBe(PILLAR_COUNT);
  });
});
