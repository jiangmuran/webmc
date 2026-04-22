import { describe, it, expect } from 'vitest';
import { rotateXZ, mirrorXZ, rotateFacing, mirrorFacing } from './structure_rotate';

describe('structure rotation', () => {
  it('rotate 0 is identity', () => {
    expect(rotateXZ({ x: 1, y: 2, z: 3 }, 0)).toEqual({ x: 1, y: 2, z: 3 });
  });
  it('rotate 90 CW', () => {
    expect(rotateXZ({ x: 1, y: 0, z: 0 }, 90)).toEqual({ x: 0, y: 0, z: 1 });
  });
  it('rotate 180 negates xz', () => {
    expect(rotateXZ({ x: 1, y: 5, z: 2 }, 180)).toEqual({ x: -1, y: 5, z: -2 });
  });
  it('360 round-trip', () => {
    const v = { x: 3, y: 0, z: 7 };
    const a = rotateXZ(rotateXZ(rotateXZ(rotateXZ(v, 90), 90), 90), 90);
    expect(a).toEqual(v);
  });

  it('mirror x flips x', () => {
    expect(mirrorXZ({ x: 5, y: 0, z: 2 }, 'x')).toEqual({ x: -5, y: 0, z: 2 });
  });

  it('facing rotates', () => {
    expect(rotateFacing('north', 90)).toBe('east');
    expect(rotateFacing('north', 180)).toBe('south');
    expect(rotateFacing('west', 90)).toBe('north');
  });

  it('mirror facing', () => {
    expect(mirrorFacing('east', 'x')).toBe('west');
    expect(mirrorFacing('north', 'z')).toBe('south');
    expect(mirrorFacing('north', 'x')).toBe('north');
  });
});
