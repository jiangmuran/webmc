import { describe, it, expect } from 'vitest';
import { specialBehavior } from './dispenser_place_block';

describe('dispenser special', () => {
  it('shulker places in air', () => {
    const r = specialBehavior('webmc:red_shulker_box', {
      blockId: 'webmc:air',
      isAir: true,
      isFluidSource: null,
    });
    expect(r.kind).toBe('place_block');
  });

  it('shulker drops if blocked', () => {
    const r = specialBehavior('webmc:red_shulker_box', {
      blockId: 'webmc:stone',
      isAir: false,
      isFluidSource: null,
    });
    expect(r.kind).toBe('drop');
  });

  it('bone meal grows', () => {
    const r = specialBehavior('webmc:bone_meal', {
      blockId: 'webmc:wheat',
      isAir: false,
      isFluidSource: null,
    });
    expect(r.kind).toBe('bonemeal_grow');
  });

  it('water bucket empties into air', () => {
    const r = specialBehavior('webmc:water_bucket', {
      blockId: 'webmc:air',
      isAir: true,
      isFluidSource: null,
    });
    expect(r.kind).toBe('bucket_empty');
  });

  it('bucket fills source', () => {
    const r = specialBehavior('webmc:bucket', {
      blockId: 'webmc:water',
      isAir: false,
      isFluidSource: 'water',
    });
    expect(r.kind).toBe('bucket_fill');
  });

  it('unknown = drop', () => {
    expect(
      specialBehavior('webmc:stone', { blockId: 'webmc:air', isAir: true, isFluidSource: null })
        .kind,
    ).toBe('drop');
  });
});
