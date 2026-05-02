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

  it('release places water in world, leaves empty bucket (wiki)', () => {
    // Wiki: "places a water source block, and spawns the cod back
    // into the world, leaving an empty bucket in the player's
    // inventory."
    expect(returnsEmptyBucketAfterRelease()).toBe(true);
    expect(returnsWaterBucketAfterRelease()).toBe(false);
  });
});
