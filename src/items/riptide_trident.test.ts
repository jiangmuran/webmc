import { describe, it, expect } from 'vitest';
import {
  canLaunch,
  launchVelocityBps,
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
});
