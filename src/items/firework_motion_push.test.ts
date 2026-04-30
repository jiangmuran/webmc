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
    expect(flightDurationTicks(3, () => 0)).toBeGreaterThan(flightDurationTicks(1, () => 0));
  });

  it('LifeTime = (Flight+1)*10 + random(0..5) + random(0..6) (wiki NBT)', () => {
    expect(flightDurationTicks(1, () => 0)).toBe(20);
    expect(flightDurationTicks(2, () => 0)).toBe(30);
    expect(flightDurationTicks(3, () => 0)).toBe(40);
    // Max with rand→0.999 should add 5 + 6 = 11 ticks
    expect(flightDurationTicks(1, () => 0.999)).toBe(20 + 11);
    expect(flightDurationTicks(3, () => 0.999)).toBe(40 + 11);
  });
});
