import { describe, it, expect } from 'vitest';
import {
  frictionFor,
  applyFriction,
  shouldMelt,
  GROUND_FRICTION,
  FROSTED_ICE_MAX_AGE,
} from './ice_slip_physics';

describe('ice physics', () => {
  it('blue ice slipperiest', () => {
    expect(frictionFor('blue_ice')).toBeGreaterThan(frictionFor('ice'));
  });

  it('apply friction slows', () => {
    const r = applyFriction({ velX: 1, velZ: 0, onIce: null });
    expect(r.velX).toBe(GROUND_FRICTION);
  });

  it('melt regular under bright light', () => {
    expect(shouldMelt({ kind: 'ice', lightLevel: 12 })).toBe(true);
    expect(shouldMelt({ kind: 'ice', lightLevel: 5 })).toBe(false);
  });

  it('packed ice does not melt', () => {
    expect(shouldMelt({ kind: 'packed_ice', lightLevel: 15 })).toBe(false);
  });

  it('frosted always melts', () => {
    expect(shouldMelt({ kind: 'frosted_ice', lightLevel: 0 })).toBe(true);
  });

  it('max age set', () => {
    expect(FROSTED_ICE_MAX_AGE).toBeGreaterThan(0);
  });
});
