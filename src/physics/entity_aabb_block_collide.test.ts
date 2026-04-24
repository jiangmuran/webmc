import { describe, it, expect } from 'vitest';
import { intersects, moveAndCollide, type AABB } from './entity_aabb_block_collide';

const player: AABB = {
  minX: 0,
  minY: 1,
  minZ: 0,
  maxX: 0.6,
  maxY: 2.8,
  maxZ: 0.6,
};

describe('entity AABB block collision', () => {
  it('intersecting boxes detected', () => {
    expect(intersects(player, player)).toBe(true);
  });

  it('disjoint boxes no overlap', () => {
    const far: AABB = { minX: 10, minY: 10, minZ: 10, maxX: 11, maxY: 11, maxZ: 11 };
    expect(intersects(player, far)).toBe(false);
  });

  it('fall onto ground', () => {
    const ground: AABB = { minX: -5, minY: 0, minZ: -5, maxX: 5, maxY: 1, maxZ: 5 };
    const r = moveAndCollide(player, 0, -2, 0, [ground]);
    expect(r.onGround).toBe(true);
  });

  it('free air no ground', () => {
    expect(moveAndCollide(player, 0, -1, 0, []).onGround).toBe(false);
  });
});
