import { describe, it, expect } from 'vitest';
import { add, sub, scale, dot, cross, length, normalize, lerp, distance } from './vec3_math';

describe('vec3 math', () => {
  it('add', () => {
    expect(add({ x: 1, y: 2, z: 3 }, { x: 10, y: 20, z: 30 })).toEqual({ x: 11, y: 22, z: 33 });
  });

  it('sub', () => {
    expect(sub({ x: 5, y: 5, z: 5 }, { x: 1, y: 2, z: 3 })).toEqual({ x: 4, y: 3, z: 2 });
  });

  it('scale', () => {
    expect(scale({ x: 1, y: 2, z: 3 }, 2)).toEqual({ x: 2, y: 4, z: 6 });
  });

  it('dot', () => {
    expect(dot({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(0);
    expect(dot({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toBe(32);
  });

  it('cross', () => {
    expect(cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toEqual({ x: 0, y: 0, z: 1 });
  });

  it('length', () => {
    expect(length({ x: 3, y: 4, z: 0 })).toBe(5);
  });

  it('normalize', () => {
    const n = normalize({ x: 3, y: 4, z: 0 });
    expect(length(n)).toBeCloseTo(1);
  });

  it('lerp halfway', () => {
    expect(lerp({ x: 0, y: 0, z: 0 }, { x: 10, y: 10, z: 10 }, 0.5)).toEqual({ x: 5, y: 5, z: 5 });
  });

  it('distance', () => {
    expect(distance({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 5 })).toBe(5);
  });
});
