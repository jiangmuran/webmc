import { describe, it, expect } from 'vitest';
import { canThrow, takesMeltDamage, leavesSnowTrail, RANGE } from './snow_golem_projectile';

describe('snow golem projectile', () => {
  it('in range throws', () => {
    expect(
      canThrow({ targetDistance: RANGE, inWarmBiome: false, inRain: false, hp: 4 }),
    ).toBe(true);
  });

  it('dead no throw', () => {
    expect(
      canThrow({ targetDistance: 5, inWarmBiome: false, inRain: false, hp: 0 }),
    ).toBe(false);
  });

  it('warm biome melts', () => {
    expect(
      takesMeltDamage({ targetDistance: 5, inWarmBiome: true, inRain: false, hp: 4 }),
    ).toBe(true);
  });

  it('rain melts', () => {
    expect(
      takesMeltDamage({ targetDistance: 5, inWarmBiome: false, inRain: true, hp: 4 }),
    ).toBe(true);
  });

  it('leaves trail', () => {
    expect(leavesSnowTrail()).toBe(true);
  });
});
