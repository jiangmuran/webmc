import { describe, it, expect } from 'vitest';
import { placeSlab, stairShape, type StairNeighbors } from './slab_vertical_stack';

describe('slab placement', () => {
  it('places bottom on top of block', () => {
    const r = placeSlab({
      existingBlockId: null,
      existingHalf: null,
      newSlabId: 'webmc:oak_slab',
      clickedFace: 'top',
      clickedOnUpperHalfOfFace: false,
    });
    expect(r.kind).toBe('place_single');
    if (r.kind === 'place_single') expect(r.half).toBe('bottom');
  });

  it('places top on ceiling', () => {
    const r = placeSlab({
      existingBlockId: null,
      existingHalf: null,
      newSlabId: 'webmc:oak_slab',
      clickedFace: 'bottom',
      clickedOnUpperHalfOfFace: false,
    });
    if (r.kind === 'place_single') expect(r.half).toBe('top');
  });

  it('side face splits by upper/lower', () => {
    const a = placeSlab({
      existingBlockId: null,
      existingHalf: null,
      newSlabId: 'webmc:oak_slab',
      clickedFace: 'side',
      clickedOnUpperHalfOfFace: true,
    });
    if (a.kind === 'place_single') expect(a.half).toBe('top');
  });

  it('combines into double', () => {
    const r = placeSlab({
      existingBlockId: 'webmc:oak_slab',
      existingHalf: 'bottom',
      newSlabId: 'webmc:oak_slab',
      clickedFace: 'top',
      clickedOnUpperHalfOfFace: false,
    });
    expect(r.kind).toBe('make_double');
  });

  it('different slab invalid', () => {
    const r = placeSlab({
      existingBlockId: 'webmc:oak_slab',
      existingHalf: 'bottom',
      newSlabId: 'webmc:stone_slab',
      clickedFace: 'top',
      clickedOnUpperHalfOfFace: false,
    });
    expect(r.kind).toBe('invalid');
  });
});

describe('stair shape', () => {
  function n(o: Partial<StairNeighbors>): StairNeighbors {
    return {
      frontIsSameFacing: false,
      backIsSameFacing: false,
      leftIsSameFacing: false,
      rightIsSameFacing: false,
      ...o,
    };
  }

  it('straight default', () => {
    expect(stairShape(n({}))).toBe('straight');
  });

  it('outer corner', () => {
    expect(stairShape(n({ frontIsSameFacing: true, leftIsSameFacing: true }))).toBe('outer_left');
  });

  it('inner corner', () => {
    expect(stairShape(n({ backIsSameFacing: true, rightIsSameFacing: true }))).toBe('inner_right');
  });
});
