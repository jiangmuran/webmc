import { describe, it, expect } from 'vitest';
import {
  boneMealSeagrass,
  MAX_KELP_HEIGHT,
  tryKelpGrow,
  type SeagrassLookup,
} from './seagrass_grow';

const WATER_ABOVE_SAND: SeagrassLookup = {
  isWater: () => true,
  isWaterTop: () => true,
  topSolidBelow: () => true,
};

describe('bone meal seagrass', () => {
  it('spawns events in water + sand', () => {
    const events = boneMealSeagrass({
      center: { x: 0, y: 60, z: 0 },
      radius: 3,
      lookup: WATER_ABOVE_SAND,
      rng: () => 0.05,
    });
    expect(events.length).toBeGreaterThan(0);
  });

  it('no events without floor', () => {
    const events = boneMealSeagrass({
      center: { x: 0, y: 60, z: 0 },
      radius: 3,
      lookup: { ...WATER_ABOVE_SAND, topSolidBelow: () => false },
      rng: () => 0.01,
    });
    expect(events).toEqual([]);
  });

  it('no events outside water', () => {
    const events = boneMealSeagrass({
      center: { x: 0, y: 60, z: 0 },
      radius: 3,
      lookup: { ...WATER_ABOVE_SAND, isWater: () => false },
      rng: () => 0.01,
    });
    expect(events).toEqual([]);
  });
});

describe('kelp growth', () => {
  it('grows on low roll', () => {
    expect(tryKelpGrow({ age: 5, roll: 0.01, topIsWaterAndAirBlock: true })).toBe(true);
  });

  it('stops at max height', () => {
    expect(tryKelpGrow({ age: MAX_KELP_HEIGHT, roll: 0.01, topIsWaterAndAirBlock: true })).toBe(
      false,
    );
  });

  it('cannot grow without water above', () => {
    expect(tryKelpGrow({ age: 5, roll: 0.01, topIsWaterAndAirBlock: false })).toBe(false);
  });
});
