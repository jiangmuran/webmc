import { describe, it, expect } from 'vitest';
import { effectiveAirTick, damageThisTick } from './mob_drowning_damage';

describe('mob drowning damage', () => {
  it('water breathing preserves air', () => {
    const c = effectiveAirTick({
      airSupply: 20,
      maxAir: 20,
      waterBreathingRemainingTicks: 100,
      hasHelmetRespiration: false,
    });
    expect(c.airSupply).toBe(20);
  });

  it('no effect decrements air', () => {
    expect(
      effectiveAirTick({
        airSupply: 20,
        maxAir: 20,
        waterBreathingRemainingTicks: 0,
        hasHelmetRespiration: false,
      }).airSupply,
    ).toBe(19);
  });

  it('respiration halves loss', () => {
    expect(
      effectiveAirTick({
        airSupply: 20,
        maxAir: 20,
        waterBreathingRemainingTicks: 0,
        hasHelmetRespiration: true,
      }).airSupply,
    ).toBe(19.5);
  });

  it('no damage with air', () => {
    expect(
      damageThisTick({
        airSupply: 5,
        maxAir: 20,
        waterBreathingRemainingTicks: 0,
        hasHelmetRespiration: false,
      }),
    ).toBe(0);
  });
});
