import { describe, it, expect } from 'vitest';
import { classify, qualifies, topYForKind } from './heightmap_types';

describe('heightmap types', () => {
  it('air classifies as air', () => {
    const c = classify('webmc:air');
    expect(c.isAir).toBe(true);
  });

  it('leaves flagged', () => {
    expect(classify('webmc:oak_leaves').isLeaves).toBe(true);
  });

  it('water is fluid, not motion-blocking', () => {
    const c = classify('webmc:water');
    expect(c.isFluid).toBe(true);
    expect(c.blocksMotion).toBe(false);
  });

  it('world_surface includes leaves', () => {
    expect(qualifies('WORLD_SURFACE', classify('webmc:oak_leaves'))).toBe(true);
  });

  it('ocean_floor excludes water', () => {
    expect(qualifies('OCEAN_FLOOR', classify('webmc:water'))).toBe(false);
    expect(qualifies('OCEAN_FLOOR', classify('webmc:stone'))).toBe(true);
  });

  it('motion_blocking includes water', () => {
    expect(qualifies('MOTION_BLOCKING', classify('webmc:water'))).toBe(true);
  });

  it('motion_blocking_no_leaves skips leaves', () => {
    expect(qualifies('MOTION_BLOCKING_NO_LEAVES', classify('webmc:oak_leaves'))).toBe(false);
  });

  it('topYForKind', () => {
    const column = [
      'webmc:bedrock',
      'webmc:stone',
      'webmc:dirt',
      'webmc:grass_block',
      'webmc:oak_leaves',
      'webmc:air',
    ];
    expect(topYForKind('WORLD_SURFACE', column)).toBe(4);
    expect(topYForKind('MOTION_BLOCKING_NO_LEAVES', column)).toBe(3);
  });

  it('empty column = -1', () => {
    expect(topYForKind('WORLD_SURFACE', ['webmc:air', 'webmc:air'])).toBe(-1);
  });
});
