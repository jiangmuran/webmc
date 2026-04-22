import { describe, it, expect } from 'vitest';
import {
  lodForDistance,
  lodCoalesceBlocks,
  meshTriangleFactor,
  lodWithHysteresis,
  LOD_RADII_CHUNKS,
} from './chunk_mesh_lod';

describe('chunk LOD', () => {
  it('near = 0', () => {
    expect(lodForDistance(1)).toBe(0);
  });

  it('far = 3', () => {
    expect(lodForDistance(100)).toBe(3);
  });

  it('coalesce doubles per level', () => {
    expect(lodCoalesceBlocks(0)).toBe(1);
    expect(lodCoalesceBlocks(3)).toBe(8);
  });

  it('triangle factor drops', () => {
    expect(meshTriangleFactor(1)).toBeLessThan(meshTriangleFactor(0));
  });

  it('hysteresis prevents churn', () => {
    // LOD_RADII_CHUNKS[0]=4, HYSTERESIS=2
    expect(lodWithHysteresis(0, 5)).toBe(0); // 5 > 4+? no, 5 <= 4+2, stay
    expect(lodWithHysteresis(0, 7)).toBe(1); // past buffer
  });

  it('upgrade requires margin', () => {
    // Currently LOD 1, radius 8. Upgrade to 0 (near) requires dist < 4-2=2
    expect(lodWithHysteresis(1, 3)).toBe(1);
    expect(lodWithHysteresis(1, 1)).toBe(0);
  });

  it('radii strictly ascending', () => {
    const r = [0, 1, 2, 3].map((l) => LOD_RADII_CHUNKS[l as 0 | 1 | 2 | 3]);
    expect(r[0]).toBeLessThan(r[1] ?? 0);
    expect(r[1]).toBeLessThan(r[2] ?? 0);
  });
});
