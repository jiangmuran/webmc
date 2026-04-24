import { describe, it, expect } from 'vitest';
import {
  bobOffset,
  damageBobIntensity,
  MAX_BOB_AMPLITUDE,
  type ViewBobInput,
} from './first_person_view_bob';

const walking: ViewBobInput = { walkSpeed: 0.2, onGround: true, ticks: 5, enabled: true };

describe('first person view bob', () => {
  it('disabled returns zero', () => {
    expect(bobOffset({ ...walking, enabled: false })).toEqual({ dx: 0, dy: 0, dz: 0 });
  });

  it('midair no bob', () => {
    expect(bobOffset({ ...walking, onGround: false })).toEqual({ dx: 0, dy: 0, dz: 0 });
  });

  it('walking produces offset', () => {
    const o = bobOffset(walking);
    expect(Math.abs(o.dx) + Math.abs(o.dy)).toBeGreaterThan(0);
  });

  it('bob capped', () => {
    const o = bobOffset({ ...walking, walkSpeed: 100 });
    expect(Math.abs(o.dx)).toBeLessThanOrEqual(MAX_BOB_AMPLITUDE);
  });

  it('low health intensifies damage bob', () => {
    expect(damageBobIntensity(0.2)).toBeGreaterThan(damageBobIntensity(0.8));
  });

  it('full health zero bob', () => {
    expect(damageBobIntensity(1)).toBe(0);
  });
});
