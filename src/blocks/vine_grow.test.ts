import { describe, it, expect } from 'vitest';
import {
  addFace,
  canClimb,
  hasFace,
  removeFace,
  tickVine,
  VINE_FACE_EAST,
  VINE_FACE_NORTH,
  VINE_FACE_WEST,
  vineIsSupported,
} from './vine_grow';

describe('vines', () => {
  it('grow when solid face available', () => {
    const r = tickVine({
      current: { faces: 0 },
      solidFaces: VINE_FACE_NORTH,
      roll: 0.1,
    });
    expect(r.grew).toBe(true);
    expect(r.newFaces & VINE_FACE_NORTH).toBe(VINE_FACE_NORTH);
  });

  it('do not grow on high roll', () => {
    const r = tickVine({
      current: { faces: 0 },
      solidFaces: VINE_FACE_NORTH,
      roll: 0.9,
    });
    expect(r.grew).toBe(false);
  });

  it('skip faces already attached', () => {
    const r = tickVine({
      current: { faces: VINE_FACE_NORTH },
      solidFaces: VINE_FACE_NORTH | VINE_FACE_EAST,
      roll: 0.1,
    });
    expect(r.newFaces & VINE_FACE_EAST).toBe(VINE_FACE_EAST);
  });

  it('no solid faces = no growth', () => {
    const r = tickVine({
      current: { faces: 0 },
      solidFaces: 0,
      roll: 0.1,
    });
    expect(r.grew).toBe(false);
  });

  it('face manipulation', () => {
    const v = { faces: 0 };
    addFace(v, VINE_FACE_WEST);
    expect(hasFace(v, VINE_FACE_WEST)).toBe(true);
    removeFace(v, VINE_FACE_WEST);
    expect(hasFace(v, VINE_FACE_WEST)).toBe(false);
  });

  it('unsupported vine breaks', () => {
    expect(vineIsSupported({ faces: 0 })).toBe(false);
    expect(canClimb({ faces: 0 })).toBe(false);
  });

  it('supported vine climbable', () => {
    expect(canClimb({ faces: VINE_FACE_NORTH })).toBe(true);
  });
});
