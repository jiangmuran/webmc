import { describe, it, expect } from 'vitest';
import { isShearableBlock, canShearMob, SHEARS_DURABILITY } from './shears_use';

describe('shears use', () => {
  it('leaves shearable', () => {
    expect(isShearableBlock('oak_leaves')).toBe(true);
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
