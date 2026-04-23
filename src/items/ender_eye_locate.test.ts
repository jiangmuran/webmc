import { describe, it, expect } from 'vitest';
import { directionToTarget, shouldBreak, BREAK_CHANCE } from './ender_eye_locate';

describe('ender eye locate', () => {
  it('points east', () => {
    const d = directionToTarget({ x: 0, z: 0 }, { x: 10, z: 0 });
    expect(d.dx).toBeCloseTo(1);
    expect(d.dz).toBeCloseTo(0);
  });

  it('zero distance is zero', () => {
    expect(directionToTarget({ x: 1, z: 1 }, { x: 1, z: 1 })).toEqual({ dx: 0, dz: 0 });
  });

  it('breaks at low rng', () => {
    expect(shouldBreak(() => 0)).toBe(true);
  });

  it('survives at high rng', () => {
    expect(shouldBreak(() => 0.99)).toBe(false);
  });

  it('20 percent break', () => {
    expect(BREAK_CHANCE).toBeCloseTo(0.2);
  });
});
