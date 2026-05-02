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

// Wiki (minecraft.wiki/w/Bucket_of_Cod and siblings): "Pressing use
// with a bucket of cod places a water source block, and spawns the
// cod back into the world, leaving an empty bucket in the player's
// inventory." So release: water source block placed IN THE WORLD,
// EMPTY bucket left in inventory. Old code had the booleans
// inverted (claimed a water bucket was returned, no empty bucket).
export function returnsEmptyBucketAfterRelease(): boolean {
  return true;
}

export function returnsWaterBucketAfterRelease(): boolean {
  return false;
}
