import { describe, it, expect } from 'vitest';
import {
  isActive,
  grantRadius,
  hostileDamageRadius,
  hostileDamageThisTick,
  MIN_FRAME,
  MAX_FRAME,
  HOSTILE_DAMAGE,
  HOSTILE_DAMAGE_INTERVAL_TICKS,
} from './conduit_sphere_power';

describe('conduit', () => {
  it('inactive without submerged', () => {
    expect(isActive({ prismarineBlocks: MIN_FRAME, submerged: false })).toBe(false);
  });

  it('minimum active', () => {
    expect(isActive({ prismarineBlocks: MIN_FRAME, submerged: true })).toBe(true);
  });

  it('radius grows', () => {
    const small = grantRadius({ prismarineBlocks: MIN_FRAME, submerged: true });
    const big = grantRadius({ prismarineBlocks: MAX_FRAME, submerged: true });
    expect(big).toBeGreaterThan(small);
    expect(big).toBeLessThanOrEqual(96);
  });

  it('hostile radius = half grant', () => {
    const q = { prismarineBlocks: MAX_FRAME, submerged: true };
    expect(hostileDamageRadius(q)).toBeGreaterThan(0);
  });

  it('damage timing', () => {
    expect(hostileDamageThisTick(0, true)).toBe(HOSTILE_DAMAGE);
    expect(hostileDamageThisTick(HOSTILE_DAMAGE_INTERVAL_TICKS, true)).toBe(HOSTILE_DAMAGE);
    expect(hostileDamageThisTick(10, true)).toBe(0);
    expect(hostileDamageThisTick(0, false)).toBe(0);
  });
});
