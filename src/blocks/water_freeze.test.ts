import { describe, it, expect } from 'vitest';
import { canFreeze, frozenBlock } from './water_freeze';

describe('water freeze', () => {
  it('freezes in cold biome with sky', () => {
    expect(
      canFreeze({ biomeTemp: -0.1, hasSkylight: true, isWaterSource: true, nearbySolidCount: 1 }),
    ).toBe(true);
  });

  it('not without sky', () => {
    expect(
      canFreeze({ biomeTemp: -0.1, hasSkylight: false, isWaterSource: true, nearbySolidCount: 1 }),
    ).toBe(false);
  });

  it('warm biome no freeze', () => {
    expect(
      canFreeze({ biomeTemp: 0.8, hasSkylight: true, isWaterSource: true, nearbySolidCount: 1 }),
    ).toBe(false);
  });

  it('flowing water does not freeze', () => {
    expect(
      canFreeze({ biomeTemp: -1, hasSkylight: true, isWaterSource: false, nearbySolidCount: 1 }),
    ).toBe(false);
  });

  it('freezes to ice', () => {
    expect(frozenBlock()).toBe('ice');
  });
});
