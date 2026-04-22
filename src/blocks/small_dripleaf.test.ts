import { describe, it, expect } from 'vitest';
import {
  canPlace,
  bonemealGrowsBig,
  harvestWithShears,
  harvestWithoutShears,
  SMALL_DRIPLEAF_HEIGHT_BLOCKS,
} from './small_dripleaf';

describe('small dripleaf', () => {
  it('requires clay + water', () => {
    expect(canPlace({ onClayOrMoss: true, inWater: true })).toBe(true);
    expect(canPlace({ onClayOrMoss: false, inWater: true })).toBe(false);
    expect(canPlace({ onClayOrMoss: true, inWater: false })).toBe(false);
  });

  it('bonemeal usually grows', () => {
    expect(bonemealGrowsBig(() => 0)).toBe(true);
  });

  it('bonemeal occasionally fails', () => {
    expect(bonemealGrowsBig(() => 0.99)).toBe(false);
  });

  it('shears drop 1', () => {
    expect(harvestWithShears()).toBe(1);
  });

  it('no shears no drop', () => {
    expect(harvestWithoutShears()).toBe(0);
  });

  it('2 block tall', () => {
    expect(SMALL_DRIPLEAF_HEIGHT_BLOCKS).toBe(2);
  });
});
