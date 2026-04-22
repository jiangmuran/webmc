import { describe, it, expect } from 'vitest';
import { veinShape, hasAnyFace, shouldSpread, SPREAD_CHANCE } from './sculk_vein_spread';

describe('sculk vein', () => {
  it('no faces without surfaces', () => {
    const empty = {
      top: { solidHere: false, sculkAdjacent: false },
      bottom: { solidHere: false, sculkAdjacent: false },
      north: { solidHere: false, sculkAdjacent: false },
      south: { solidHere: false, sculkAdjacent: false },
      east: { solidHere: false, sculkAdjacent: false },
      west: { solidHere: false, sculkAdjacent: false },
    };
    expect(hasAnyFace(veinShape({ faces: empty }))).toBe(false);
  });

  it('face formed on solid with sculk nearby', () => {
    const s = veinShape({
      faces: {
        top: { solidHere: true, sculkAdjacent: true },
        bottom: { solidHere: false, sculkAdjacent: false },
        north: { solidHere: false, sculkAdjacent: false },
        south: { solidHere: false, sculkAdjacent: false },
        east: { solidHere: false, sculkAdjacent: false },
        west: { solidHere: false, sculkAdjacent: false },
      },
    });
    expect(s.on).toEqual(['top']);
  });

  it('spread respects roll', () => {
    expect(
      shouldSpread({ targetFace: 'top', surfaceSolid: true, hasSculkNearby: true, rand: () => 0 }),
    ).toBe(true);
    expect(
      shouldSpread({
        targetFace: 'top',
        surfaceSolid: true,
        hasSculkNearby: true,
        rand: () => SPREAD_CHANCE + 0.001,
      }),
    ).toBe(false);
  });

  it('no spread without surface', () => {
    expect(
      shouldSpread({ targetFace: 'top', surfaceSolid: false, hasSculkNearby: true, rand: () => 0 }),
    ).toBe(false);
  });
});
