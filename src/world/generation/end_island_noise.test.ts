import { describe, it, expect } from 'vitest';
import {
  endIslandDensity,
  isEndIsland,
  insideCentralIsland,
  CENTRAL_ISLAND_RADIUS,
} from './end_island_noise';

describe('end island noise', () => {
  it('central positive density', () => {
    expect(endIslandDensity(0, 0)).toBeGreaterThan(0);
  });

  it('far negative density', () => {
    expect(endIslandDensity(500, 500)).toBeLessThan(0);
  });

  it('central inside', () => {
    expect(insideCentralIsland(0, 0)).toBe(true);
  });

  it('outside central radius', () => {
    expect(insideCentralIsland(CENTRAL_ISLAND_RADIUS + 1, 0)).toBe(false);
  });

  it('far outer island can appear', () => {
    expect(isEndIsland(500, 500, () => 0.01)).toBe(true);
  });

  it('central no outer island', () => {
    expect(isEndIsland(10, 10, () => 0.01)).toBe(false);
  });
});
