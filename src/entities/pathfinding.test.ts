import { describe, it, expect } from 'vitest';
import { findPath } from './pathfinding';

function flatFloor(_x: number, y: number, _z: number): boolean {
  return y <= 40;
}

describe('pathfinding', () => {
  it('finds a straight-line path on flat terrain', () => {
    const path = findPath({ x: 0, y: 41, z: 0 }, { x: 5, y: 41, z: 0 }, flatFloor);
    expect(path).not.toBeNull();
    expect(path?.[0]).toEqual({ x: 0, y: 41, z: 0 });
    expect(path?.[path.length - 1]).toEqual({ x: 5, y: 41, z: 0 });
    expect(path?.length).toBe(6);
  });

  it('finds a diagonal-ish path (four-way) respecting manhattan', () => {
    const path = findPath({ x: 0, y: 41, z: 0 }, { x: 3, y: 41, z: 3 }, flatFloor);
    expect(path).not.toBeNull();
    expect(path?.length).toBeLessThanOrEqual(8);
  });

  it('returns null when start or goal is not standable', () => {
    const p1 = findPath({ x: 0, y: 42, z: 0 }, { x: 5, y: 41, z: 0 }, flatFloor);
    expect(p1).toBeNull();
  });

  it('routes around a 1×height wall via jump', () => {
    const isSolid = (x: number, y: number, _z: number): boolean => {
      if (y <= 40) return true;
      if (x === 2 && y === 41) return true;
      return false;
    };
    const path = findPath({ x: 0, y: 41, z: 0 }, { x: 4, y: 41, z: 0 }, isSolid);
    expect(path).not.toBeNull();
    const ys = path?.map((n) => n.y) ?? [];
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(42);
  });

  it('aborts after maxExpansions on unreachable goal', () => {
    const wall = (x: number, y: number, _z: number): boolean => y <= 40 || x === 1;
    const path = findPath({ x: 0, y: 41, z: 0 }, { x: 10, y: 41, z: 0 }, wall, {
      maxExpansions: 200,
    });
    expect(path).toBeNull();
  });

  it('handles downhill descents within maxFallDown', () => {
    const step = (_x: number, y: number, z: number): boolean => {
      if (z === 0 && y <= 40) return true;
      if (z === 1 && y <= 38) return true;
      return false;
    };
    const path = findPath({ x: 0, y: 41, z: 0 }, { x: 0, y: 39, z: 1 }, step);
    expect(path).not.toBeNull();
  });
});
