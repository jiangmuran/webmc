// Axolotl (and other fish) bucket. Using an empty bucket on a mob of
// the "bucketable" kind captures it into a bucket with NBT tracking
// the mob's specific variant / name / age; releasing places the mob
// back into water.

export type BucketableMob =
  | 'axolotl'
  | 'cod'
  | 'salmon'
  | 'tropical_fish'
  | 'pufferfish'
  | 'tadpole';

export interface BucketedMob {
  kind: BucketableMob;
  variant?: string; // e.g. axolotl color, tropical pattern
  name?: string; // nametag preserved
  health?: number;
  ageTicks?: number;
  bucketItemId: string;
}

const BUCKET_ITEMS: Record<BucketableMob, string> = {
  axolotl: 'webmc:axolotl_bucket',
  cod: 'webmc:cod_bucket',
  salmon: 'webmc:salmon_bucket',
  tropical_fish: 'webmc:tropical_fish_bucket',
  pufferfish: 'webmc:pufferfish_bucket',
  tadpole: 'webmc:tadpole_bucket',
};

export function bucketItemFor(kind: BucketableMob): string {
  return BUCKET_ITEMS[kind];
}

export interface BucketQuery {
  kind: BucketableMob;
  variant?: string;
  name?: string;
  health?: number;
  ageTicks?: number;
  hasEmptyBucket: boolean;
}

export function captureMob(q: BucketQuery): BucketedMob | null {
  if (!q.hasEmptyBucket) return null;
  return {
    kind: q.kind,
    ...(q.variant !== undefined ? { variant: q.variant } : {}),
    ...(q.name !== undefined ? { name: q.name } : {}),
    ...(q.health !== undefined ? { health: q.health } : {}),
    ...(q.ageTicks !== undefined ? { ageTicks: q.ageTicks } : {}),
    bucketItemId: BUCKET_ITEMS[q.kind],
  };
}

// Releasing: places the mob back in water (or on ground for tadpoles
// out of water — they start out-of-water timer immediately).
export interface ReleaseQuery {
  bucket: BucketedMob;
  targetIsWater: boolean;
}

export interface ReleaseResult {
  released: boolean;
  newState: {
    kind: BucketableMob;
    variant?: string;
    name?: string;
    health: number;
    ageTicks: number;
  } | null;
  yieldsEmptyBucket: boolean;
}

export function releaseMob(q: ReleaseQuery): ReleaseResult {
  if (!q.targetIsWater && q.bucket.kind !== 'tadpole') {
    return { released: false, newState: null, yieldsEmptyBucket: false };
  }
  return {
    released: true,
    newState: {
      kind: q.bucket.kind,
      ...(q.bucket.variant !== undefined ? { variant: q.bucket.variant } : {}),
      ...(q.bucket.name !== undefined ? { name: q.bucket.name } : {}),
      health: q.bucket.health ?? 10,
      ageTicks: q.bucket.ageTicks ?? 0,
    },
    yieldsEmptyBucket: true,
  };
}

export function isBucketable(mob: string): boolean {
  return Object.keys(BUCKET_ITEMS).includes(mob);
}
