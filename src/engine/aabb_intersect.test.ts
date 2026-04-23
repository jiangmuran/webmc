import { describe, it, expect } from 'vitest';
import { intersects, contains, expand, sweptOverlap } from './aabb_intersect';

const a = { minX: 0, minY: 0, minZ: 0, maxX: 1, maxY: 1, maxZ: 1 };
const b = { minX: 0.5, minY: 0.5, minZ: 0.5, maxX: 2, maxY: 2, maxZ: 2 };
const far = { minX: 10, minY: 10, minZ: 10, maxX: 11, maxY: 11, maxZ: 11 };

describe('aabb intersect', () => {
  it('overlapping boxes', () => {
    expect(intersects(a, b)).toBe(true);
  });

  it('disjoint boxes', () => {
    expect(intersects(a, far)).toBe(false);
  });

  it('contains point', () => {
    expect(contains(a, 0.5, 0.5, 0.5)).toBe(true);
    expect(contains(a, 2, 2, 2)).toBe(false);
  });

  it('expand grows', () => {
    const e = expand(a, 1, 0, 0);
    expect(e.minX).toBe(-1);
    expect(e.maxX).toBe(2);
  });

  it('sweep detects future hit', () => {
    expect(sweptOverlap(a, far, 15, 15, 15)).toBe(true);
  });

  it('sweep misses', () => {
    expect(sweptOverlap(a, far, 0, 0, 0)).toBe(false);
  });
});
