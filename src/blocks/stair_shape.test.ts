import { describe, it, expect } from 'vitest';
import { computeStairShape, type StairBlock, type StairLookup } from './stair_shape';

function lookup(neighbors: Record<string, StairBlock>): StairLookup {
  return {
    stairAt: (dx, _dy, dz) => neighbors[`${dx},${dz}`] ?? null,
  };
}

describe('stair shape', () => {
  it('no neighbors = straight', () => {
    const s = computeStairShape({ facing: 'north', half: 'bottom' }, lookup({}));
    expect(s).toBe('straight');
  });

  it('perpendicular front stair = outer corner', () => {
    const s = computeStairShape(
      { facing: 'north', half: 'bottom' },
      lookup({
        '0,-1': { facing: 'east', half: 'bottom', shape: 'straight', waterlogged: false },
      }),
    );
    expect(s).toBe('outer_right');
  });

  it('perpendicular back stair = inner corner', () => {
    const s = computeStairShape(
      { facing: 'north', half: 'bottom' },
      lookup({
        '0,1': { facing: 'east', half: 'bottom', shape: 'straight', waterlogged: false },
      }),
    );
    expect(s).toBe('inner_right');
  });

  it('different half = no corner', () => {
    const s = computeStairShape(
      { facing: 'north', half: 'bottom' },
      lookup({
        '0,-1': { facing: 'east', half: 'top', shape: 'straight', waterlogged: false },
      }),
    );
    expect(s).toBe('straight');
  });

  it('parallel neighbor = straight', () => {
    const s = computeStairShape(
      { facing: 'north', half: 'bottom' },
      lookup({
        '0,-1': { facing: 'south', half: 'bottom', shape: 'straight', waterlogged: false },
      }),
    );
    expect(s).toBe('straight');
  });
});
