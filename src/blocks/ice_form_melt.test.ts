import { describe, it, expect } from 'vitest';
import { shouldFreezeWater, shouldMeltIce, COLD_THRESHOLD } from './ice_form_melt';

describe('ice form melt', () => {
  it('freezes at night in cold', () => {
    expect(
      shouldFreezeWater({
        biomeTemperature: 0,
        isNight: true,
        hasSkyLight: true,
        nearbyWarmBlock: false,
        lightLevel: 0,
      }),
    ).toBe(true);
  });

  it('no freeze in warm biome', () => {
    expect(
      shouldFreezeWater({
        biomeTemperature: 0.8,
        isNight: true,
        hasSkyLight: true,
        nearbyWarmBlock: false,
        lightLevel: 0,
      }),
    ).toBe(false);
  });

  it('no freeze in day', () => {
    expect(
      shouldFreezeWater({
        biomeTemperature: 0,
        isNight: false,
        hasSkyLight: true,
        nearbyWarmBlock: false,
        lightLevel: 0,
      }),
    ).toBe(false);
  });

  it('warm block melts', () => {
    expect(
      shouldMeltIce({
        biomeTemperature: 0,
        isNight: true,
        hasSkyLight: true,
        nearbyWarmBlock: true,
        lightLevel: 0,
      }),
    ).toBe(true);
  });

  it('bright light melts', () => {
    expect(
      shouldMeltIce({
        biomeTemperature: 0,
        isNight: true,
        hasSkyLight: true,
        nearbyWarmBlock: false,
        lightLevel: 13,
      }),
    ).toBe(true);
  });

  it('cold threshold', () => {
    expect(COLD_THRESHOLD).toBeLessThan(0.5);
  });
});
