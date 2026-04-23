import { describe, it, expect } from 'vitest';
import { elytraFireworkAccel, flightDurationTicks } from './firework_motion_push';

describe('firework motion push', () => {
  it('accel aligns with look', () => {
    const a = elytraFireworkAccel({ x: 1, y: 0, z: 0 });
    expect(a.dvx).toBeGreaterThan(0);
    expect(a.dvy).toBeCloseTo(0);
    expect(a.dvz).toBeCloseTo(0);
  });

  it('normalized', () => {
    const a = elytraFireworkAccel({ x: 10, y: 0, z: 0 });
    expect(Math.abs(a.dvx)).toBeLessThanOrEqual(1);
  });

  it('zero vector safe', () => {
    const a = elytraFireworkAccel({ x: 0, y: 0, z: 0 });
    expect(Number.isFinite(a.dvx)).toBe(true);
  });

  it('longer flight more ticks', () => {
    expect(flightDurationTicks(3)).toBeGreaterThan(flightDurationTicks(1));
  });
});
