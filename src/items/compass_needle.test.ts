import { describe, it, expect } from 'vitest';
import { angleToSpawn, spinsInDimension, lodestoneOverrides } from './compass_needle';

describe('compass needle', () => {
  it('east of spawn points west-ish', () => {
    const a = angleToSpawn({ x: 10, z: 0 }, { x: 0, z: 0 });
    expect(Math.abs(a)).toBeCloseTo(Math.PI);
  });

  it('spins in nether', () => {
    expect(spinsInDimension('nether')).toBe(true);
    expect(spinsInDimension('overworld')).toBe(false);
  });

  it('lodestone overrides', () => {
    expect(lodestoneOverrides({ x: 0, z: 0 })).toBe(true);
    expect(lodestoneOverrides()).toBe(false);
  });
});
