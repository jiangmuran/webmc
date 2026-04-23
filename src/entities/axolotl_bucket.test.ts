import { describe, it, expect } from 'vitest';
import { bucketize, releaseFromBucket, AXOLOTL_BUCKET_STACK_MAX } from './axolotl_bucket';

describe('axolotl bucket', () => {
  it('preserves nbt', () => {
    const a = { variant: 'lucy' as const, age: 0, customName: null, health: 14 };
    const b = bucketize(a);
    expect(b.item).toBe('axolotl_bucket');
    expect(b.nbt).toEqual(a);
  });

  it('release restores', () => {
    const a = { variant: 'gold' as const, age: -24000, customName: 'Sunny', health: 10 };
    expect(releaseFromBucket(a)).toEqual(a);
  });

  it('unstackable', () => {
    expect(AXOLOTL_BUCKET_STACK_MAX).toBe(1);
  });
});
