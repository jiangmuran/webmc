import { describe, it, expect } from 'vitest';
import {
  inPickupRange,
  attractVelocity,
  expired,
  LIFETIME_TICKS,
  type XpOrb,
} from './xp_orb_pickup';

const orb: XpOrb = { x: 0, y: 0, z: 0, value: 3, ageTicks: 0 };

describe('xp orb pickup', () => {
  it('pickup within 1.5m', () => {
    expect(inPickupRange(orb, 1, 0, 0)).toBe(true);
  });

  it('out of range', () => {
    expect(inPickupRange(orb, 5, 0, 0)).toBe(false);
  });

  it('attract nearby', () => {
    const v = attractVelocity(orb, 3, 0, 0);
    expect(v.dx).toBeGreaterThan(0);
  });

  it('no attract far', () => {
    expect(attractVelocity(orb, 100, 0, 0)).toEqual({ dx: 0, dy: 0, dz: 0 });
  });

  it('co-located no divide', () => {
    const v = attractVelocity(orb, 0, 0, 0);
    expect(Number.isFinite(v.dx)).toBe(true);
  });

  it('expires after 5 min', () => {
    expect(expired({ ...orb, ageTicks: LIFETIME_TICKS })).toBe(true);
    expect(expired({ ...orb, ageTicks: LIFETIME_TICKS - 1 })).toBe(false);
  });
});
