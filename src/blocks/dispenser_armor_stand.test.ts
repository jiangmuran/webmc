import { describe, it, expect } from 'vitest';
import { equipsInsteadOfEjects, shearWaterBucketPlaces } from './dispenser_armor_stand';

describe('dispenser armor stand', () => {
  it('equips helmet on empty slot', () => {
    expect(
      equipsInsteadOfEjects({
        itemId: 'iron_helmet',
        targetEntity: 'armor_stand',
        targetWearsSlot: undefined,
      }),
    ).toBe(true);
  });

  it('stick does not equip', () => {
    expect(
      equipsInsteadOfEjects({
        itemId: 'stick',
        targetEntity: 'armor_stand',
        targetWearsSlot: undefined,
      }),
    ).toBe(false);
  });

  it('full slot skips', () => {
    expect(
      equipsInsteadOfEjects({
        itemId: 'iron_helmet',
        targetEntity: 'armor_stand',
        targetWearsSlot: 'helmet',
      }),
    ).toBe(false);
  });

  it('water bucket places water', () => {
    expect(
      shearWaterBucketPlaces({ itemId: 'water_bucket', targetWearsSlot: undefined }),
    ).toBe(true);
  });
});
