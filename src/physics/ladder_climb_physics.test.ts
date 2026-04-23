import { describe, it, expect } from 'vitest';
import { climbedVY, cancelsFallDamage, CLIMB_UP_VY, CLIMB_DOWN_VY } from './ladder_climb_physics';

const base = {
  onClimbable: true,
  wantUp: false,
  wantDown: false,
  sneaking: false,
  vyBeforeClimb: -5,
};

describe('ladder climb physics', () => {
  it('no ladder keeps prior vy', () => {
    expect(climbedVY({ ...base, onClimbable: false })).toBe(-5);
  });

  it('sneak holds position', () => {
    expect(climbedVY({ ...base, sneaking: true })).toBe(0);
  });

  it('up climbs', () => {
    expect(climbedVY({ ...base, wantUp: true })).toBe(CLIMB_UP_VY);
  });

  it('down descends', () => {
    expect(climbedVY({ ...base, wantDown: true })).toBe(CLIMB_DOWN_VY);
  });

  it('passive slides', () => {
    expect(climbedVY(base)).toBeLessThan(0);
  });

  it('ladder cancels fall damage', () => {
    expect(cancelsFallDamage(base)).toBe(true);
  });
});
