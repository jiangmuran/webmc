import { describe, it, expect } from 'vitest';
import {
  canLaunch,
  launchVelocityBps,
  launchVelocityBpsFor,
  trajectoryFactor,
  incompatibleWith,
} from './riptide_trident';

describe('riptide trident', () => {
  it('no level no launch', () => {
    expect(canLaunch({ inWater: true, inRain: false, level: 0 })).toBe(false);
  });

  it('launches in water', () => {
    expect(canLaunch({ inWater: true, inRain: false, level: 1 })).toBe(true);
  });

  it('launches in rain', () => {
    expect(canLaunch({ inWater: false, inRain: true, level: 2 })).toBe(true);
  });

  it('dry no launch', () => {
    expect(canLaunch({ inWater: false, inRain: false, level: 3 })).toBe(false);
  });

  it('velocity scales', () => {
    expect(launchVelocityBps(1)).toBeLessThan(launchVelocityBps(3));
  });

  it('trajectory factor = bps/20', () => {
    expect(trajectoryFactor(3)).toBeCloseTo(launchVelocityBps(3) / 20);
  });

  it('incompat loyalty + channeling', () => {
    const ex = incompatibleWith();
    expect(ex).toContain('loyalty');
    expect(ex).toContain('channeling');
  });

  it('rain/surface velocity = 6L+3 (wiki)', () => {
    // Wiki (minecraft.wiki/w/Riptide): "(6 × level) + 3 when in rain
    // or standing in water". 9 / 15 / 21 b/s at I / II / III.
    expect(launchVelocityBpsFor(1, { inWater: false, inRain: true, level: 1 })).toBe(9);
    expect(launchVelocityBpsFor(2, { inWater: false, inRain: true, level: 2 })).toBe(15);
    expect(launchVelocityBpsFor(3, { inWater: false, inRain: true, level: 3 })).toBe(21);
  });

  it('submerged velocity = 4L+3 (wiki)', () => {
    // Wiki: "(4 × level) + 3 while underwater". 7 / 11 / 15 b/s.
    expect(launchVelocityBpsFor(1, { inWater: true, inRain: false, level: 1 })).toBe(7);
    expect(launchVelocityBpsFor(2, { inWater: true, inRain: false, level: 2 })).toBe(11);
    expect(launchVelocityBpsFor(3, { inWater: true, inRain: false, level: 3 })).toBe(15);
  });

  it('standing-in-shallow + submerged-flag → surface formula', () => {
    // Player standing in 1-block-deep water (feet wet, head dry) gets
    // the rain-equivalent surface formula even if `inWater` is true.
    expect(
      launchVelocityBpsFor(2, {
        inWater: true,
        inRain: false,
        level: 2,
        standingInShallowWater: true,
      }),
    ).toBe(15);
  });
});
