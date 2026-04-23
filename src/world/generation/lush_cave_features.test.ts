import { describe, it, expect } from 'vitest';
import { surfaceBlock, cavePlantsFor, azaleaTreeAbove } from './lush_cave_features';

describe('lush cave features', () => {
  it('surface is moss', () => {
    expect(surfaceBlock()).toBe('moss_block');
  });

  it('plants list non-empty on lucky rng', () => {
    expect(cavePlantsFor(() => 0).length).toBeGreaterThan(0);
  });

  it('unlucky empty', () => {
    expect(cavePlantsFor(() => 0.99).length).toBe(0);
  });

  it('has azalea tree marker', () => {
    expect(azaleaTreeAbove()).toBe(true);
  });
});
