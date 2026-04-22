import { describe, it, expect } from 'vitest';
import { bucketItemFor, captureMob, isBucketable, releaseMob } from './axolotl_bucket';

describe('axolotl bucket', () => {
  it('bucket item id per kind', () => {
    expect(bucketItemFor('axolotl')).toBe('webmc:axolotl_bucket');
    expect(bucketItemFor('pufferfish')).toBe('webmc:pufferfish_bucket');
  });

  it('capture preserves variant', () => {
    const b = captureMob({
      kind: 'axolotl',
      variant: 'pink',
      hasEmptyBucket: true,
    });
    expect(b?.variant).toBe('pink');
  });

  it('cannot capture without bucket', () => {
    expect(captureMob({ kind: 'cod', hasEmptyBucket: false })).toBeNull();
  });

  it('release fish in water', () => {
    const b = {
      kind: 'salmon' as const,
      bucketItemId: 'webmc:salmon_bucket',
      health: 3,
      ageTicks: 100,
    };
    const r = releaseMob({ bucket: b, targetIsWater: true });
    expect(r.released).toBe(true);
    expect(r.yieldsEmptyBucket).toBe(true);
  });

  it('fish cannot be released on land', () => {
    const b = {
      kind: 'salmon' as const,
      bucketItemId: 'webmc:salmon_bucket',
      health: 3,
      ageTicks: 100,
    };
    const r = releaseMob({ bucket: b, targetIsWater: false });
    expect(r.released).toBe(false);
  });

  it('tadpole can release on land', () => {
    const b = {
      kind: 'tadpole' as const,
      bucketItemId: 'webmc:tadpole_bucket',
      health: 6,
      ageTicks: 500,
    };
    expect(releaseMob({ bucket: b, targetIsWater: false }).released).toBe(true);
  });

  it('isBucketable filter', () => {
    expect(isBucketable('axolotl')).toBe(true);
    expect(isBucketable('cow')).toBe(false);
  });
});
