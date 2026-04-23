import { describe, it, expect } from 'vitest';
import { cubicBezier, catmullRom } from './bezier_spline';

const p0 = { x: 0, y: 0, z: 0 };
const p1 = { x: 0, y: 10, z: 0 };
const p2 = { x: 10, y: 10, z: 0 };
const p3 = { x: 10, y: 0, z: 0 };

describe('bezier spline', () => {
  it('bezier start = p0', () => {
    expect(cubicBezier(p0, p1, p2, p3, 0)).toEqual(p0);
  });

  it('bezier end = p3', () => {
    expect(cubicBezier(p0, p1, p2, p3, 1)).toEqual(p3);
  });

  it('catmull-rom passes through p1 at t=0', () => {
    expect(catmullRom(p0, p1, p2, p3, 0)).toEqual(p1);
  });

  it('catmull-rom passes through p2 at t=1', () => {
    expect(catmullRom(p0, p1, p2, p3, 1)).toEqual(p2);
  });

  it('bezier midpoint between endpoints', () => {
    const m = cubicBezier(p0, p1, p2, p3, 0.5);
    expect(m.x).toBeGreaterThan(p0.x);
    expect(m.x).toBeLessThan(p3.x);
  });
});
