import { describe, it, expect } from 'vitest';
import { placedFacing, opaqueFace, hopperBlocksWhenPointing } from './glazed_terracotta_rotation';

describe('glazed terracotta rotation', () => {
  it('facing south at 0', () => {
    expect(placedFacing(0)).toBe('south');
  });

  it('east at 270', () => {
    expect(placedFacing(270)).toBe('east');
  });

  it('wraps negative', () => {
    expect(placedFacing(-90)).toBe('east');
  });

  it('opaque', () => {
    expect(opaqueFace()).toBe(true);
  });

  it('hopper blocks if match', () => {
    expect(hopperBlocksWhenPointing('north', 'north')).toBe(true);
    expect(hopperBlocksWhenPointing('north', 'south')).toBe(false);
  });
});
