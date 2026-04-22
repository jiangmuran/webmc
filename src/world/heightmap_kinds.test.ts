import { describe, it, expect } from 'vitest';
import { isAir, predicateFor } from './heightmap_kinds';

describe('heightmap kinds', () => {
  it('air set', () => {
    expect(isAir('webmc:air')).toBe(true);
    expect(isAir('webmc:cave_air')).toBe(true);
    expect(isAir('webmc:stone')).toBe(false);
  });

  it('world_surface ignores air', () => {
    const p = predicateFor('world_surface');
    expect(p('webmc:stone')).toBe(true);
    expect(p('webmc:air')).toBe(false);
  });

  it('ocean_floor ignores water', () => {
    const p = predicateFor('ocean_floor');
    expect(p('webmc:water')).toBe(false);
    expect(p('webmc:sand')).toBe(true);
  });

  it('motion_blocking ignores flowers', () => {
    const p = predicateFor('motion_blocking');
    expect(p('webmc:red_flower')).toBe(false);
    expect(p('webmc:stone')).toBe(true);
  });

  it('no_leaves excludes leaves', () => {
    const p = predicateFor('motion_blocking_no_leaves');
    expect(p('webmc:oak_leaves')).toBe(false);
    expect(p('webmc:stone')).toBe(true);
  });
});
