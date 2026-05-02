import { describe, it, expect } from 'vitest';
import { isShearableBlock, canShearMob, SHEARS_DURABILITY } from './shears_use';

describe('shears use', () => {
  it('leaves shearable: every wood type (wiki)', () => {
    expect(isShearableBlock('oak_leaves')).toBe(true);
    expect(isShearableBlock('spruce_leaves')).toBe(true);
    expect(isShearableBlock('birch_leaves')).toBe(true);
    expect(isShearableBlock('jungle_leaves')).toBe(true);
    expect(isShearableBlock('acacia_leaves')).toBe(true);
    expect(isShearableBlock('dark_oak_leaves')).toBe(true);
    expect(isShearableBlock('mangrove_leaves')).toBe(true);
    expect(isShearableBlock('cherry_leaves')).toBe(true);
    expect(isShearableBlock('pale_oak_leaves')).toBe(true);
    expect(isShearableBlock('azalea_leaves')).toBe(true);
    expect(isShearableBlock('flowering_azalea_leaves')).toBe(true);
  });

  it('vines shearable: all three (wiki)', () => {
    expect(isShearableBlock('vine')).toBe(true);
    expect(isShearableBlock('weeping_vines')).toBe(true);
    expect(isShearableBlock('twisting_vines')).toBe(true);
  });

  it('cobweb shearable', () => {
    expect(isShearableBlock('cobweb')).toBe(true);
  });

  it('stone not', () => {
    expect(isShearableBlock('stone')).toBe(false);
  });

  it('sheep shearable', () => {
    expect(canShearMob('sheep')).toBe(true);
  });

  it('bogged shearable', () => {
    expect(canShearMob('bogged')).toBe(true);
  });

  it('zombie not', () => {
    expect(canShearMob('zombie')).toBe(false);
  });

  it('durability 238', () => {
    expect(SHEARS_DURABILITY).toBe(238);
  });
});
