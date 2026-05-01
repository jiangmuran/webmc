import { describe, it, expect } from 'vitest';
import { canConvert, convertedBlock, tramplingPreventedByFarmland } from './dirt_path_convert';

describe('dirt path convert', () => {
  it('grass converts', () => {
    expect(canConvert({ target: 'grass_block', topBlockIsAir: true })).toBe(true);
  });

  it('stone cannot', () => {
    expect(canConvert({ target: 'stone', topBlockIsAir: true })).toBe(false);
  });

  it('air above required', () => {
    expect(canConvert({ target: 'grass_block', topBlockIsAir: false })).toBe(false);
  });

  it('converts to dirt_path', () => {
    expect(convertedBlock()).toBe('dirt_path');
  });

  it('farmland no effect', () => {
    expect(tramplingPreventedByFarmland()).toBe(false);
  });

  it('rooted_dirt does NOT convert to dirt_path (wiki)', () => {
    // Wiki (minecraft.wiki/w/Shovel): rooted_dirt is a separate shovel
    // action — converts to dirt + drops hanging_roots, not dirt_path.
    // Sibling items/shovel_path.ts has the rooted_dirt action.
    expect(canConvert({ target: 'rooted_dirt', topBlockIsAir: true })).toBe(false);
  });
});
