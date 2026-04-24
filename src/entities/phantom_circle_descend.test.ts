import { describe, it, expect } from 'vitest';
import { updateOrbit, shouldDive, type PhantomState } from './phantom_circle_descend';

const withTarget: PhantomState = {
  target: { x: 0, y: 64, z: 0 },
  x: 10,
  y: 76,
  z: 0,
  divingAngleRadians: 0,
  circleRadius: 10,
  inDiveMode: false,
};

describe('phantom circle descend', () => {
  it('no target static', () => {
    expect(updateOrbit({ ...withTarget, target: undefined }, 0.1)).toEqual({
      ...withTarget,
      target: undefined,
    });
  });

  it('orbit moves', () => {
    const next = updateOrbit(withTarget, 0.1);
    expect(next.divingAngleRadians).toBeGreaterThan(0);
  });

  it('dive mode y drops to target + 2', () => {
    const diving = updateOrbit({ ...withTarget, inDiveMode: true }, 0);
    expect(diving.y).toBe(66);
  });

  it('close enough dives', () => {
    expect(shouldDive(withTarget, false)).toBe(true);
  });

  it('sleep suppressed no dive', () => {
    expect(shouldDive(withTarget, true)).toBe(false);
  });

  it('no target no dive', () => {
    expect(shouldDive({ ...withTarget, target: undefined }, false)).toBe(false);
  });
});
