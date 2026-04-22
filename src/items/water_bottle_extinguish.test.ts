import { describe, it, expect } from 'vitest';
import { BLAZE_DAMAGE, splashWater } from './water_bottle_extinguish';

describe('splash water', () => {
  it('extinguishes fire, damages blazes, teleports endermen', () => {
    const r = splashWater(
      { x: 0, y: 0, z: 0 },
      {
        firePositions: () => [{ x: 1, y: 0, z: 0 }],
        blazeEntities: () => [1],
        endermanEntities: () => [2],
      },
    );
    expect(r.extinguishedFire.length).toBe(1);
    expect(r.damagedBlazeIds).toEqual([1]);
    expect(r.teleportedEndermanIds).toEqual([2]);
  });

  it('empty surroundings → empty result', () => {
    const r = splashWater(
      { x: 0, y: 0, z: 0 },
      { firePositions: () => [], blazeEntities: () => [], endermanEntities: () => [] },
    );
    expect(r.extinguishedFire.length).toBe(0);
  });

  it('blaze damage constant', () => {
    expect(BLAZE_DAMAGE).toBe(1);
  });
});
