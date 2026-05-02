import { describe, it, expect } from 'vitest';
import { increment, lightLevel, bonemealGrowsIfOnCoral, MAX_PICKLES } from './sea_pickle_count';

describe('sea pickle count', () => {
  it('increment caps at max', () => {
    expect(increment(4)).toBe(MAX_PICKLES);
  });

  it('dry gives no light', () => {
    expect(lightLevel(4, false)).toBe(0);
  });

  it('1 waterlogged pickle → 6 light (wiki)', () => {
    expect(lightLevel(1, true)).toBe(6);
  });

  it('4 waterlogged pickles → 15 light (wiki)', () => {
    expect(lightLevel(4, true)).toBe(15);
  });

  it('bonemeal on coral grows to max', () => {
    expect(bonemealGrowsIfOnCoral(1, true)).toBe(4);
  });

  it('bonemeal off coral noop', () => {
    expect(bonemealGrowsIfOnCoral(2, false)).toBe(2);
  });
});
