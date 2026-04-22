import { describe, it, expect } from 'vitest';
import { currentVelocity, isStillWater, PUSH_STRENGTH } from './water_current_flow';

describe('water flow', () => {
  it('still water has no velocity', () => {
    const q = {
      here: { level: 5 },
      north: { level: 5 },
      south: { level: 5 },
      east: { level: 5 },
      west: { level: 5 },
    };
    expect(isStillWater(q)).toBe(true);
  });

  it('flow from east', () => {
    const v = currentVelocity({
      here: { level: 3 },
      north: null,
      south: null,
      east: { level: 7 },
      west: null,
    });
    expect(v.vx).toBe(PUSH_STRENGTH);
  });

  it('flow from north', () => {
    const v = currentVelocity({
      here: { level: 3 },
      north: { level: 7 },
      south: null,
      east: null,
      west: null,
    });
    expect(v.vz).toBe(-PUSH_STRENGTH);
  });

  it('cross-balanced cancels', () => {
    const v = currentVelocity({
      here: { level: 3 },
      north: { level: 7 },
      south: { level: 7 },
      east: null,
      west: null,
    });
    expect(v.vz).toBe(0);
  });
});
