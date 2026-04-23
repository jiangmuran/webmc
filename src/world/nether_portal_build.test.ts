import { describe, it, expect } from 'vitest';
import { validFrame, interiorCells } from './nether_portal_build';

function boundary(i: number, j: number, w: number, h: number): boolean {
  return i === 0 || j === 0 || i === w - 1 || j === h - 1;
}

describe('nether portal build', () => {
  it('canonical 4x5 frame', () => {
    expect(
      validFrame({
        w: 4,
        h: 5,
        axis: 'x',
        isObsidian: (i, j) => boundary(i, j, 4, 5),
        isAir: (i, j) => !boundary(i, j, 4, 5),
      }),
    ).toBe(true);
  });

  it('too small', () => {
    expect(
      validFrame({
        w: 3,
        h: 5,
        axis: 'x',
        isObsidian: () => true,
        isAir: () => true,
      }),
    ).toBe(false);
  });

  it('missing corner', () => {
    expect(
      validFrame({
        w: 4,
        h: 5,
        axis: 'x',
        isObsidian: (i, j) => boundary(i, j, 4, 5) && !(i === 0 && j === 0),
        isAir: (i, j) => !boundary(i, j, 4, 5),
      }),
    ).toBe(false);
  });

  it('interior cells 2x3 = 6', () => {
    expect(interiorCells(4, 5).length).toBe(6);
  });
});
