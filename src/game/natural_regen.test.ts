import { describe, it, expect } from 'vitest';
import { regenIntervalTicks, shouldRegen } from './natural_regen';

describe('natural regen', () => {
  it('fast regen when saturated', () => {
    expect(
      regenIntervalTicks({
        hunger: 20,
        saturation: 5,
        hp: 10,
        maxHp: 20,
        ticksSinceLastRegen: 0,
      }),
    ).toBe(10);
  });

  it('slow regen when hungry but fed', () => {
    expect(
      regenIntervalTicks({
        hunger: 18,
        saturation: 0,
        hp: 10,
        maxHp: 20,
        ticksSinceLastRegen: 0,
      }),
    ).toBe(80);
  });

  it('no regen below threshold', () => {
    expect(
      regenIntervalTicks({
        hunger: 10,
        saturation: 0,
        hp: 10,
        maxHp: 20,
        ticksSinceLastRegen: 0,
      }),
    ).toBeUndefined();
  });

  it('full HP no regen', () => {
    expect(
      regenIntervalTicks({
        hunger: 20,
        saturation: 5,
        hp: 20,
        maxHp: 20,
        ticksSinceLastRegen: 0,
      }),
    ).toBeUndefined();
  });

  it('fires after interval', () => {
    expect(
      shouldRegen({
        hunger: 20,
        saturation: 5,
        hp: 10,
        maxHp: 20,
        ticksSinceLastRegen: 15,
      }),
    ).toBe(true);
  });
});
