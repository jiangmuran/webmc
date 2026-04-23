import { describe, it, expect } from 'vitest';
import { clamp } from './sneak_edge_clamp';

describe('sneak edge clamp', () => {
  it('no sneak passes through', () => {
    expect(
      clamp({
        sneaking: false,
        onGround: true,
        proposedDx: 1,
        proposedDz: 1,
        ledgeX: true,
        ledgeZ: true,
      }),
    ).toEqual({ dx: 1, dz: 1 });
  });

  it('sneak clamps at ledge', () => {
    const r = clamp({
      sneaking: true,
      onGround: true,
      proposedDx: 1,
      proposedDz: 1,
      ledgeX: true,
      ledgeZ: false,
    });
    expect(r.dx).toBe(0);
    expect(r.dz).toBe(1);
  });

  it('airborne sneak ignored', () => {
    expect(
      clamp({
        sneaking: true,
        onGround: false,
        proposedDx: 1,
        proposedDz: 0,
        ledgeX: true,
        ledgeZ: true,
      }).dx,
    ).toBe(1);
  });
});
