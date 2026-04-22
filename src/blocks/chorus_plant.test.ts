import { describe, it, expect } from 'vitest';
import { tickChorusPlant, type ChorusLookup } from './chorus_plant';

const ALL_AIR: ChorusLookup = {
  isEndStoneBelow: () => true,
  isAir: () => true,
  height: () => 0,
};

describe('chorus plant', () => {
  it('grows upward when given the chance', () => {
    const r = tickChorusPlant({ x: 0, y: 10, z: 0 }, ALL_AIR, () => 0.01);
    expect(r.placements.length).toBeGreaterThan(0);
    expect(r.placements[0]?.pos.y).toBe(11);
  });

  it('places flower at max height', () => {
    const lookup: ChorusLookup = {
      ...ALL_AIR,
      height: () => 6,
    };
    const r = tickChorusPlant({ x: 0, y: 10, z: 0 }, lookup, () => 0.01);
    expect(r.placements.some((p) => p.block === 'webmc:chorus_flower')).toBe(true);
  });

  it('no growth when rng above chance', () => {
    const r = tickChorusPlant({ x: 0, y: 10, z: 0 }, ALL_AIR, () => 0.99);
    expect(r.placements.length).toBe(0);
  });

  it('no growth into solid block', () => {
    const lookup: ChorusLookup = {
      ...ALL_AIR,
      isAir: () => false,
    };
    const r = tickChorusPlant({ x: 0, y: 10, z: 0 }, lookup, () => 0.01);
    expect(r.placements.length).toBe(0);
  });
});
