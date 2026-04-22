import { describe, it, expect } from 'vitest';
import { cauldronHeatState } from './cauldron_campfire';

describe('hot cauldron', () => {
  it('boils over lit campfire', () => {
    const r = cauldronHeatState({
      cauldronContent: 'water',
      cauldronLevel: 3,
      campfireBelow: true,
      campfireLit: true,
    });
    expect(r.isBoiling).toBe(true);
    expect(r.damagesOccupants).toBe(true);
  });

  it("unlit campfire doesn't boil", () => {
    const r = cauldronHeatState({
      cauldronContent: 'water',
      cauldronLevel: 3,
      campfireBelow: true,
      campfireLit: false,
    });
    expect(r.isBoiling).toBe(false);
  });

  it('lava cauldron always damages + ignites', () => {
    const r = cauldronHeatState({
      cauldronContent: 'lava',
      cauldronLevel: 3,
      campfireBelow: false,
      campfireLit: false,
    });
    expect(r.damagesOccupants).toBe(true);
    expect(r.appliesFireEffect).toBe(true);
  });

  it('empty cauldron → no effect', () => {
    const r = cauldronHeatState({
      cauldronContent: 'empty',
      cauldronLevel: 0,
      campfireBelow: true,
      campfireLit: true,
    });
    expect(r.isBoiling).toBe(false);
  });
});
