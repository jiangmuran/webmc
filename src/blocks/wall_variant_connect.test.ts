import { describe, it, expect } from 'vitest';
import { wallShape, type WallQuery } from './wall_variant_connect';

function q(
  over: Partial<
    Record<
      'north' | 'south' | 'east' | 'west',
      { wall: boolean; full: boolean; fenceGate: boolean }
    >
  > = {},
  hasFullAbove = false,
): WallQuery {
  const empty = { wall: false, full: false, fenceGate: false };
  return {
    hasFullAbove,
    adjacent: {
      north: { ...empty, ...over.north },
      south: { ...empty, ...over.south },
      east: { ...empty, ...over.east },
      west: { ...empty, ...over.west },
    },
  };
}

describe('wall shape', () => {
  it('isolated = post only', () => {
    const r = wallShape(q());
    expect(r.post).toBe(true);
  });

  it('straight NS no post', () => {
    const r = wallShape(
      q({
        north: { wall: true, full: false, fenceGate: false },
        south: { wall: true, full: false, fenceGate: false },
      }),
    );
    expect(r.post).toBe(false);
    expect(r.up.north).toBe('low');
  });

  it('corner gets post', () => {
    const r = wallShape(
      q({
        north: { wall: true, full: false, fenceGate: false },
        east: { wall: true, full: false, fenceGate: false },
      }),
    );
    expect(r.post).toBe(true);
  });

  it('full above = tall', () => {
    const r = wallShape(
      q(
        {
          north: { wall: true, full: false, fenceGate: false },
          south: { wall: true, full: false, fenceGate: false },
        },
        true,
      ),
    );
    expect(r.up.north).toBe('tall');
  });
});
