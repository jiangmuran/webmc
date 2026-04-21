import { describe, it, expect } from 'vitest';
import {
  FACE_NX,
  FACE_NY,
  FACE_NZ,
  FACE_PX,
  FACE_PY,
  FACE_PZ,
  faceNormal,
  raycastVoxels,
} from './raycast';

describe('raycastVoxels', () => {
  it('hits a straight-ahead block along +x', () => {
    const solid = (x: number, y: number, z: number) => x === 5 && y === 0 && z === 0;
    const hit = raycastVoxels({ x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, 10, solid);
    expect(hit).not.toBeNull();
    expect(hit?.bx).toBe(5);
    expect(hit?.face).toBe(FACE_NX);
    expect(hit?.distance).toBeCloseTo(4.5, 5);
  });

  it('hits directly below along -y', () => {
    const solid = (x: number, y: number, z: number) => x === 0 && y === -3 && z === 0;
    const hit = raycastVoxels({ x: 0.5, y: 0.5, z: 0.5 }, { x: 0, y: -1, z: 0 }, 10, solid);
    expect(hit).not.toBeNull();
    expect(hit?.by).toBe(-3);
    expect(hit?.face).toBe(FACE_PY);
    expect(hit?.distance).toBeCloseTo(2.5, 5);
  });

  it('returns null when no solid is hit within maxDistance', () => {
    expect(raycastVoxels({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 5, () => false)).toBeNull();
  });

  it('returns null when solid is beyond maxDistance', () => {
    const solid = (x: number, _y: number, _z: number) => x === 20;
    expect(raycastVoxels({ x: 0, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, 10, solid)).toBeNull();
  });

  it('returns distance=0 and face=PY when origin is inside a solid', () => {
    const solid = () => true;
    const hit = raycastVoxels({ x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, 5, solid);
    expect(hit).not.toBeNull();
    expect(hit?.distance).toBe(0);
    expect(hit?.face).toBe(FACE_PY);
  });

  it('resolves the first hit on a diagonal ray', () => {
    const solid = (x: number, y: number, z: number) =>
      (x === 3 && y === 3 && z === 0) || (x === 5 && y === 5 && z === 0);
    const hit = raycastVoxels({ x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 1, z: 0 }, 20, solid);
    expect(hit).not.toBeNull();
    expect(hit?.bx).toBe(3);
    expect(hit?.by).toBe(3);
  });

  it('detects the correct face on a -z ray hitting +z face', () => {
    const solid = (_x: number, _y: number, z: number) => z === -3;
    const hit = raycastVoxels({ x: 0.5, y: 0.5, z: 0.5 }, { x: 0, y: 0, z: -1 }, 10, solid);
    expect(hit?.face).toBe(FACE_PZ);
  });

  it('returns null on zero-length direction', () => {
    expect(raycastVoxels({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 10, () => true)).toBeNull();
  });

  it('faceNormal returns unit axis-aligned vectors', () => {
    expect(faceNormal(FACE_NX)).toEqual([-1, 0, 0]);
    expect(faceNormal(FACE_PX)).toEqual([1, 0, 0]);
    expect(faceNormal(FACE_NY)).toEqual([0, -1, 0]);
    expect(faceNormal(FACE_PY)).toEqual([0, 1, 0]);
    expect(faceNormal(FACE_NZ)).toEqual([0, 0, -1]);
    expect(faceNormal(FACE_PZ)).toEqual([0, 0, 1]);
  });
});
