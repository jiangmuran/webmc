import { describe, it, expect } from 'vitest';
import {
  generateStrongholdPositions,
  distanceToNearest,
  STRONGHOLDS_PER_RING,
  STRONGHOLD_RING_DISTANCES,
} from './stronghold_locate';

describe('stronghold locate', () => {
  it('first ring count', () => {
    const p = generateStrongholdPositions(42, 0);
    expect(p.length).toBe(STRONGHOLDS_PER_RING[0]);
  });

  it('positions on ring radius', () => {
    const ring = 0;
    const p = generateStrongholdPositions(1, ring);
    const r = STRONGHOLD_RING_DISTANCES[ring] ?? 0;
    for (const pos of p) {
      expect(Math.hypot(pos.x, pos.z)).toBeCloseTo(r, -1);
    }
  });

  it('deterministic per seed', () => {
    expect(generateStrongholdPositions(42, 0)).toEqual(generateStrongholdPositions(42, 0));
  });

  it('distance nearest', () => {
    const pts = [
      { x: 100, z: 0 },
      { x: 200, z: 0 },
    ];
    expect(distanceToNearest(pts, 0, 0)).toBe(100);
  });
});
