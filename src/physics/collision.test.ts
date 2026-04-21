import { describe, it, expect } from 'vitest';
import { aabbIntersectsSolid, sweepMove } from './collision';

const BOX = { halfX: 0.3, halfY: 0.9, halfZ: 0.3 };

describe('aabbIntersectsSolid', () => {
  it('no overlap when all sampled voxels are empty', () => {
    const pos = { x: 0.5, y: 40.5, z: 0.5 };
    expect(aabbIntersectsSolid(pos, BOX, () => false)).toBe(false);
  });

  it('overlap when any overlapped voxel is solid', () => {
    const solid = (x: number, y: number, z: number) => x === 0 && y === 40 && z === 0;
    const pos = { x: 0.5, y: 40.5, z: 0.5 };
    expect(aabbIntersectsSolid(pos, BOX, solid)).toBe(true);
  });

  it('no overlap when player is just above the floor voxel', () => {
    const solid = (_x: number, y: number, _z: number) => y === 39;
    const pos = { x: 0.5, y: 40 + BOX.halfY, z: 0.5 };
    expect(aabbIntersectsSolid(pos, BOX, solid)).toBe(false);
  });
});

describe('sweepMove', () => {
  function floorAtY40(): (x: number, y: number, z: number) => boolean {
    return (_x, y, _z) => y <= 39;
  }

  it('unobstructed move applies velocity fully', () => {
    const pos = { x: 0.5, y: 45, z: 0.5 };
    const dv = { x: 0.1, y: 0, z: 0.1 };
    const out = sweepMove(pos, BOX, dv, () => false);
    expect(pos.x).toBeCloseTo(0.6, 5);
    expect(pos.z).toBeCloseTo(0.6, 5);
    expect(out.hitX).toBe(false);
    expect(out.onGround).toBe(false);
  });

  it('falling player stops on the ground at y = 40 + halfY', () => {
    const pos = { x: 0.5, y: 41, z: 0.5 };
    let onGround = false;
    for (let i = 0; i < 200; i++) {
      const dv = { x: 0, y: -0.05, z: 0 };
      const out = sweepMove(pos, BOX, dv, floorAtY40());
      if (out.onGround) {
        onGround = true;
        break;
      }
    }
    expect(onGround).toBe(true);
    expect(pos.y).toBeGreaterThanOrEqual(40 + BOX.halfY - 0.05);
    expect(pos.y).toBeLessThanOrEqual(40 + BOX.halfY + 0.05);
  });

  it('horizontal collision cancels the offending axis, leaves others', () => {
    const wall = (x: number, _y: number, _z: number) => x >= 2;
    const pos = { x: 1.0, y: 45, z: 0.5 };
    const dv = { x: 0.9, y: 0, z: 0.1 };
    const out = sweepMove(pos, BOX, dv, wall);
    expect(out.hitX).toBe(true);
    expect(pos.x).toBeCloseTo(1.0, 5);
    expect(pos.z).toBeCloseTo(0.6, 5);
  });

  it('ceiling collision cancels only vertical movement', () => {
    const ceiling = (_x: number, y: number, _z: number) => y >= 43;
    const pos = { x: 0.5, y: 41, z: 0.5 };
    const dv = { x: 0.1, y: 2.0, z: 0 };
    const out = sweepMove(pos, BOX, dv, ceiling);
    expect(out.hitY).toBe(true);
    expect(out.onGround).toBe(false);
    expect(pos.y).toBeCloseTo(41, 5);
    expect(pos.x).toBeCloseTo(0.6, 5);
  });
});
