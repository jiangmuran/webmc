import { describe, it, expect } from 'vitest';
import {
  PORTAL_MIN_INNER_HEIGHT,
  PORTAL_MIN_INNER_WIDTH,
  tryIgnitePortal,
  type FrameLookup,
} from './nether_portal_spawn';

// A 2×3 inner frame centered at x=0..1, y=1..3, z=0 (axis=x).
function makeFrameLookup(innerW = 2, innerH = 3): FrameLookup {
  const inXRange = (x: number): boolean => x >= 0 && x < innerW;
  const inYRange = (y: number): boolean => y >= 1 && y <= innerH;
  return {
    isAir: (x, y, z) => inXRange(x) && inYRange(y) && z === 0,
    isObsidian: (x, y, z) => {
      if (z !== 0) return false;
      if (x === -1 || x === innerW) return y >= 0 && y <= innerH + 1; // sides
      if (y === 0 || y === innerH + 1) return inXRange(x); // floor/ceil
      return false;
    },
  };
}

describe('nether portal', () => {
  it('ignites valid 2×3 frame', () => {
    const l = makeFrameLookup(2, 3);
    const r = tryIgnitePortal({
      ignitePos: { x: 0, y: 1, z: 0 },
      axis: 'x',
      lookup: l,
    });
    expect(r.success).toBe(true);
    expect(r.portalBlocks.length).toBe(6);
    expect(r.innerWidth).toBe(2);
    expect(r.innerHeight).toBe(3);
  });

  it('refuses non-obsidian floor', () => {
    const l: FrameLookup = {
      isAir: () => true,
      isObsidian: () => false,
    };
    const r = tryIgnitePortal({
      ignitePos: { x: 0, y: 1, z: 0 },
      axis: 'x',
      lookup: l,
    });
    expect(r.success).toBe(false);
  });

  it('respects minimum inner size', () => {
    expect(PORTAL_MIN_INNER_WIDTH).toBe(2);
    expect(PORTAL_MIN_INNER_HEIGHT).toBe(3);
  });

  it('larger inner frame (4×5)', () => {
    const l = makeFrameLookup(4, 5);
    const r = tryIgnitePortal({
      ignitePos: { x: 0, y: 1, z: 0 },
      axis: 'x',
      lookup: l,
    });
    expect(r.success).toBe(true);
    expect(r.innerWidth).toBe(4);
    expect(r.innerHeight).toBe(5);
  });
});
