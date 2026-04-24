export type BucketResult = 'water_bucket' | 'lava_bucket' | 'milk_bucket' | 'powder_snow_bucket';

export function collectFluid(fluidId: string, isSource: boolean): BucketResult | undefined {
  if (!isSource) return undefined;
  if (fluidId === 'water') return 'water_bucket';
  if (fluidId === 'lava') return 'lava_bucket';
  if (fluidId === 'powder_snow') return 'powder_snow_bucket';
  return undefined;
}

export function emptyBucketBlock(bucketId: BucketResult): string | undefined {
  if (bucketId === 'water_bucket') return 'water';
  if (bucketId === 'lava_bucket') return 'lava';
  if (bucketId === 'powder_snow_bucket') return 'powder_snow';
  return undefined;
}

export function canEmptyInNether(bucketId: BucketResult): boolean {
  return bucketId !== 'water_bucket';
}
