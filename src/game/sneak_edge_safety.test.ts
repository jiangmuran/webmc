import { describe, it, expect } from 'vitest';
import { clampEdgeMove } from './sneak_edge_safety';

describe('sneak edge', () => {
  it('not sneaking = pass through', () => {
    const r = clampEdgeMove({
      sneaking: false,
      onGround: true,
      desiredVelocity: { x: 0.2, z: 0 },
      wouldFallOffEdge: () => true,
    });
    expect(r).toEqual({ x: 0.2, z: 0 });
  });

  it('not on ground = pass', () => {
    const r = clampEdgeMove({
      sneaking: true,
      onGround: false,
      desiredVelocity: { x: 0.2, z: 0 },
      wouldFallOffEdge: () => true,
    });
    expect(r).toEqual({ x: 0.2, z: 0 });
  });

  it('keeps X if only Z falls', () => {
    const r = clampEdgeMove({
      sneaking: true,
      onGround: true,
      desiredVelocity: { x: 0.2, z: 0.2 },
      wouldFallOffEdge: (dv) => dv.z > 0, // falling only with Z
    });
    expect(r).toEqual({ x: 0.2, z: 0 });
  });

  it('stops if both fall', () => {
    const r = clampEdgeMove({
      sneaking: true,
      onGround: true,
      desiredVelocity: { x: 0.2, z: 0.2 },
      wouldFallOffEdge: () => true,
    });
    expect(r).toEqual({ x: 0, z: 0 });
  });
});
