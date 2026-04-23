import { describe, it, expect } from 'vitest';
import {
  launchVelocity,
  cancelsFallDamageOnLaunch,
  damageToMobsInPath,
} from './trident_channel_boost';

describe('trident channel boost', () => {
  it('launch direction down pitch up = up', () => {
    const v = launchVelocity({ level: 1, pitchRad: -Math.PI / 2, yawRad: 0 });
    expect(v.vy).toBeGreaterThan(0);
  });

  it('higher level more speed', () => {
    const a = launchVelocity({ level: 1, pitchRad: 0, yawRad: 0 });
    const b = launchVelocity({ level: 3, pitchRad: 0, yawRad: 0 });
    expect(Math.hypot(b.vx, b.vy, b.vz)).toBeGreaterThan(Math.hypot(a.vx, a.vy, a.vz));
  });

  it('cancels fall damage', () => {
    expect(cancelsFallDamageOnLaunch()).toBe(true);
  });

  it('path damage scales with level', () => {
    expect(damageToMobsInPath({ level: 3, pitchRad: 0, yawRad: 0 })).toBeGreaterThan(
      damageToMobsInPath({ level: 0, pitchRad: 0, yawRad: 0 }),
    );
  });
});
