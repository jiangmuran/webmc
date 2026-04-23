import { describe, it, expect } from 'vitest';
import {
  releasesAsEntity,
  returnsEmptyBucketAfterRelease,
  returnsWaterBucketAfterRelease,
} from './fish_bucket';

describe('fish bucket', () => {
  it('release preserves kind', () => {
    expect(releasesAsEntity({ kind: 'cod' }).entity).toBe('cod');
  });

  it('tropical keeps variant', () => {
    expect(releasesAsEntity({ kind: 'tropical_fish', variantTag: 42 }).variantTag).toBe(42);
  });

  it('release yields water bucket not empty', () => {
    expect(returnsEmptyBucketAfterRelease()).toBe(false);
    expect(returnsWaterBucketAfterRelease()).toBe(true);
  });
});
