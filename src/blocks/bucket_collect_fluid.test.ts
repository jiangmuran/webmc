import { describe, it, expect } from 'vitest';
import { collectFluid, emptyBucketBlock, canEmptyInNether } from './bucket_collect_fluid';

describe('bucket collect fluid', () => {
  it('source water collects', () => {
    expect(collectFluid('water', true)).toBe('water_bucket');
  });

  it('flowing water not collectable', () => {
    expect(collectFluid('water', false)).toBeUndefined();
  });

  it('lava bucket from lava', () => {
    expect(collectFluid('lava', true)).toBe('lava_bucket');
  });

  it('powder snow bucket', () => {
    expect(collectFluid('powder_snow', true)).toBe('powder_snow_bucket');
  });

  it('empty lava gives lava block', () => {
    expect(emptyBucketBlock('lava_bucket')).toBe('lava');
  });

  it('milk bucket has no fluid', () => {
    expect(emptyBucketBlock('milk_bucket')).toBeUndefined();
  });

  it('water evaporates in nether', () => {
    expect(canEmptyInNether('water_bucket')).toBe(false);
    expect(canEmptyInNether('lava_bucket')).toBe(true);
  });
});
