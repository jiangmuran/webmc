import { describe, it, expect } from 'vitest';
import { applyWaterlog, blocksWaterFlow, isWaterloggable } from './waterlogged_state';

describe('waterlogged state', () => {
  it('slab is waterloggable', () => {
    expect(isWaterloggable('webmc:oak_slab')).toBe(true);
  });

  it('dirt is not', () => {
    expect(isWaterloggable('webmc:dirt')).toBe(false);
  });

  it('place water source consumes bucket', () => {
    const r = applyWaterlog({
      blockId: 'webmc:oak_slab',
      currentWaterlogged: false,
      interacting: 'place_water_source',
    });
    expect(r.newWaterlogged).toBe(true);
    expect(r.consumedBucket).toBe(true);
  });

  it('pick up yields bucket', () => {
    const r = applyWaterlog({
      blockId: 'webmc:oak_slab',
      currentWaterlogged: true,
      interacting: 'pick_up_water',
    });
    expect(r.newWaterlogged).toBe(false);
    expect(r.yieldedBucket).toBe(true);
  });

  it('pick up dry block = no bucket', () => {
    const r = applyWaterlog({
      blockId: 'webmc:oak_slab',
      currentWaterlogged: false,
      interacting: 'pick_up_water',
    });
    expect(r.yieldedBucket).toBe(false);
  });

  it('adjacent flow waterlogs without bucket', () => {
    const r = applyWaterlog({
      blockId: 'webmc:iron_bars',
      currentWaterlogged: false,
      interacting: 'adjacent_water_flow',
    });
    expect(r.newWaterlogged).toBe(true);
    expect(r.consumedBucket).toBe(false);
  });

  it('non-waterloggable refuses', () => {
    const r = applyWaterlog({
      blockId: 'webmc:stone',
      currentWaterlogged: false,
      interacting: 'place_water_source',
    });
    expect(r.newWaterlogged).toBe(false);
  });

  it('light_block blocks flow', () => {
    expect(blocksWaterFlow('webmc:light_block')).toBe(true);
    expect(blocksWaterFlow('webmc:oak_slab')).toBe(false);
  });
});
