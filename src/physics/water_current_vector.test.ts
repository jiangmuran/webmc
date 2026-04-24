import { describe, it, expect } from 'vitest';
import { flowDirection, pushVelocity, type WaterCell } from './water_current_vector';

const still: WaterCell = { flowLevel: 0, falling: false, neighbors: {} };

describe('water current vector', () => {
  it('still water no flow', () => {
    const d = flowDirection(still);
    expect(d.dx).toBe(0);
    expect(d.dz).toBe(0);
  });

  it('flow points toward downhill', () => {
    const c: WaterCell = {
      flowLevel: 2,
      falling: false,
      neighbors: { east: 4, west: 0 },
    };
    const d = flowDirection(c);
    expect(d.dx).toBeGreaterThan(0);
  });

  it('falling pushes down', () => {
    const v = pushVelocity({ ...still, falling: true });
    expect(v.vy).toBeLessThan(0);
  });

  it('no fall no y', () => {
    expect(pushVelocity(still).vy).toBe(0);
  });

  it('push scales with strength', () => {
    const a = pushVelocity(still, 0.01);
    const b = pushVelocity(still, 0.1);
    expect(Math.abs(b.vy)).toBeGreaterThanOrEqual(Math.abs(a.vy));
  });
});
