import { describe, it, expect } from 'vitest';
import { absorbFrom, ABSORB_LIMIT } from './sponge_absorb';

describe('sponge absorb', () => {
  it('absorbs adjacent water', () => {
    const water = new Set(['1,0,0', '-1,0,0', '0,1,0']);
    const r = absorbFrom({
      at: (x, y, z) => (water.has(`${x},${y},${z}`) ? 'water' : 'air'),
      sx: 0,
      sy: 0,
      sz: 0,
    });
    expect(r.positions.length).toBe(3);
  });

  it('caps at limit', () => {
    const r = absorbFrom({ at: () => 'water', sx: 0, sy: 0, sz: 0 });
    expect(r.positions.length).toBe(ABSORB_LIMIT);
  });

  it('solid blocks stop flood', () => {
    const r = absorbFrom({
      at: (x) => (x === 0 ? 'solid' : 'water'),
      sx: 0,
      sy: 0,
      sz: 0,
    });
    expect(r.positions.length).toBe(0);
  });
});
