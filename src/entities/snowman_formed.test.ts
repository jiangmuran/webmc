import { describe, it, expect } from 'vitest';
import {
  makeSnowGolem,
  damagePerTick,
  shouldLeaveSnowTrail,
  snowballDamage,
  MAX_HP,
  MELT_DAMAGE_INTERVAL,
} from './snowman_formed';

describe('snow golem', () => {
  it('max hp 4', () => {
    expect(makeSnowGolem().hp).toBe(MAX_HP);
  });

  it('water hurts instantly', () => {
    expect(
      damagePerTick({ biomeTemperature: 0, inRain: false, inWater: true, onFire: false }, 0),
    ).toBe(1);
  });

  it('warm biome melts slowly', () => {
    expect(
      damagePerTick(
        { biomeTemperature: 1.5, inRain: false, inWater: false, onFire: false },
        MELT_DAMAGE_INTERVAL,
      ),
    ).toBe(1);
  });

  it('cold biome safe', () => {
    expect(
      damagePerTick({ biomeTemperature: 0, inRain: false, inWater: false, onFire: false }, 100),
    ).toBe(0);
  });

  it('snow trail in cold', () => {
    expect(
      shouldLeaveSnowTrail({ biomeTemperature: 0, inRain: false, inWater: false, onFire: false }),
    ).toBe(true);
    expect(
      shouldLeaveSnowTrail({ biomeTemperature: 2, inRain: false, inWater: false, onFire: false }),
    ).toBe(false);
  });

  it('snowball damages blaze only', () => {
    expect(snowballDamage('blaze')).toBe(3);
    expect(snowballDamage('zombie')).toBe(0);
  });
});
