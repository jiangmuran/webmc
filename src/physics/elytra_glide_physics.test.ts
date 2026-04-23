import { describe, it, expect } from 'vitest';
import { glideTick, glideSpeed } from './elytra_glide_physics';

describe('elytra glide physics', () => {
  it('gravity pulls down', () => {
    const a = glideTick({ vx: 0, vy: 0, vz: 0, pitch: 0 });
    expect(a.vy).toBeLessThan(0);
  });

  it('speed finite', () => {
    const a = glideTick({ vx: 1, vy: 0, vz: 0, pitch: -0.5 });
    expect(Number.isFinite(glideSpeed(a))).toBe(true);
  });

  it('pitch down accelerates forward', () => {
    const level = glideTick({ vx: 1, vy: 0, vz: 0, pitch: 0 });
    const dive = glideTick({ vx: 1, vy: 0, vz: 0, pitch: -0.7 });
    expect(glideSpeed(dive)).toBeGreaterThanOrEqual(glideSpeed(level));
  });

  it('drag bounded', () => {
    const a = glideTick({ vx: 10, vy: 0, vz: 0, pitch: 0 });
    expect(a.vx).toBeLessThan(10);
  });

  it('pitch preserved', () => {
    expect(glideTick({ vx: 0, vy: 0, vz: 0, pitch: 0.3 }).pitch).toBe(0.3);
  });
});
