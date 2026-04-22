import { describe, it, expect } from 'vitest';
import {
  shouldBurn,
  burnDamageThisTick,
  fireTicksOnBurn,
  helmetDamagePerTick,
  BURN_INTERVAL_TICKS,
  HELMET_DMG_INTERVAL_TICKS,
  BURN_DAMAGE,
} from './zombie_sun_burn';

describe('zombie sun burn', () => {
  it('direct sun = burn', () => {
    expect(
      shouldBurn({ inDirectSunlight: true, inWater: false, wearsHelmetOrPumpkin: false }),
    ).toBe(true);
  });

  it('water prevents', () => {
    expect(shouldBurn({ inDirectSunlight: true, inWater: true, wearsHelmetOrPumpkin: false })).toBe(
      false,
    );
  });

  it('helmet prevents', () => {
    expect(shouldBurn({ inDirectSunlight: true, inWater: false, wearsHelmetOrPumpkin: true })).toBe(
      false,
    );
  });

  it('burn damage periodic', () => {
    const q = { inDirectSunlight: true, inWater: false, wearsHelmetOrPumpkin: false };
    expect(burnDamageThisTick(0, q)).toBe(BURN_DAMAGE);
    expect(burnDamageThisTick(1, q)).toBe(0);
    expect(burnDamageThisTick(BURN_INTERVAL_TICKS, q)).toBe(BURN_DAMAGE);
  });

  it('fire ticks on burn', () => {
    expect(
      fireTicksOnBurn({ inDirectSunlight: true, inWater: false, wearsHelmetOrPumpkin: false }),
    ).toBeGreaterThan(0);
  });

  it('helmet damage slow', () => {
    const q = { inDirectSunlight: true, inWater: false, wearsHelmetOrPumpkin: true };
    expect(helmetDamagePerTick(HELMET_DMG_INTERVAL_TICKS, q)).toBe(1);
    expect(helmetDamagePerTick(1, q)).toBe(0);
  });
});
