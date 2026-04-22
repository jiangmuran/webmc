import { describe, it, expect } from 'vitest';
import {
  END_VOID_Y,
  isInEndVoid,
  isOuterEnd,
  OUTER_END_START_DISTANCE,
  planEndIsland,
} from './end_island';

describe('end island', () => {
  it('plan has horizontal > vertical radius', () => {
    const i = planEndIsland({ center: { x: 0, y: 0, z: 0 }, rng: () => 0.5 });
    expect(i.horizontalRadius).toBeGreaterThan(i.verticalRadius);
  });

  it('origin is central end', () => {
    expect(isOuterEnd({ x: 0, y: 0, z: 0 })).toBe(false);
  });

  it('far point is outer end', () => {
    expect(isOuterEnd({ x: 2000, y: 0, z: 0 })).toBe(true);
  });

  it('outer start is 1000', () => {
    expect(OUTER_END_START_DISTANCE).toBe(1000);
  });

  it('void below y=-64', () => {
    expect(END_VOID_Y).toBe(-64);
    expect(isInEndVoid({ x: 0, y: -100, z: 0 })).toBe(true);
    expect(isInEndVoid({ x: 0, y: 0, z: 0 })).toBe(false);
  });
});
