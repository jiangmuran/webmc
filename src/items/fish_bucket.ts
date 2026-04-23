export type FishKind = 'cod' | 'salmon' | 'tropical_fish' | 'pufferfish' | 'axolotl';

export interface Bucket {
  kind: FishKind;
  variantTag?: number;
  customName?: string;
}

export function releasesAsEntity(b: Bucket): { entity: string; variantTag?: number } {
  return {
    entity: b.kind,
    ...(b.variantTag !== undefined ? { variantTag: b.variantTag } : {}),
  };
}

export function returnsEmptyBucketAfterRelease(): boolean {
  return false;
}

export function returnsWaterBucketAfterRelease(): boolean {
  return true;
}
