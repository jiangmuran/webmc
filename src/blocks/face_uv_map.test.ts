import { describe, it, expect } from 'vitest';
import { defaultUv, applyTextureRect } from './face_uv_map';

const fullCube = { from: { x: 0, y: 0, z: 0 }, to: { x: 16, y: 16, z: 16 } };

describe('face uv map', () => {
  it('full cube up 0..16', () => {
    expect(defaultUv(fullCube, 'up')).toEqual({ u0: 0, v0: 0, u1: 16, v1: 16 });
  });

  it('north face flips v', () => {
    const uv = defaultUv(fullCube, 'north');
    expect(uv.v0).toBe(0);
    expect(uv.v1).toBe(16);
  });

  it('east face uses z', () => {
    const uv = defaultUv(fullCube, 'east');
    expect(uv.u0).toBe(0);
    expect(uv.u1).toBe(16);
  });

  it('apply texture rect scales', () => {
    const uv = defaultUv(fullCube, 'up');
    const r = applyTextureRect(uv, 0, 0, 16);
    expect(r).toEqual({ u0: 0, v0: 0, u1: 16, v1: 16 });
  });

  it('half cube half uv', () => {
    const cube = { from: { x: 0, y: 0, z: 0 }, to: { x: 8, y: 16, z: 16 } };
    const uv = defaultUv(cube, 'up');
    expect(uv.u1).toBe(8);
  });
});
