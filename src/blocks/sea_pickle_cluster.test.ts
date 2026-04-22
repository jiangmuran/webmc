import { describe, it, expect } from 'vitest';
import { lightLevel, bonemealGrow, placeCountOnCluster } from './sea_pickle_cluster';

describe('sea pickle cluster', () => {
  it('dry no light', () => {
    expect(lightLevel({ count: 4, waterlogged: false })).toBe(0);
  });

  it('waterlogged scales 6/9/12/15', () => {
    expect(lightLevel({ count: 1, waterlogged: true })).toBe(6);
    expect(lightLevel({ count: 2, waterlogged: true })).toBe(9);
    expect(lightLevel({ count: 3, waterlogged: true })).toBe(12);
    expect(lightLevel({ count: 4, waterlogged: true })).toBe(15);
  });

  it('bonemeal increments', () => {
    expect(bonemealGrow({ count: 2, waterlogged: true }).count).toBe(3);
  });

  it('bonemeal caps at 4', () => {
    expect(bonemealGrow({ count: 4, waterlogged: true }).count).toBe(4);
  });

  it('place on cluster increments', () => {
    expect(placeCountOnCluster({ count: 1, waterlogged: true }).count).toBe(2);
  });
});
