export type CauldronFluid = 'empty' | 'water' | 'lava' | 'powder_snow';

export interface Cauldron {
  fluid: CauldronFluid;
  level: 0 | 1 | 2 | 3;
}

export function canPutBucket(c: Cauldron, bucketKind: 'water' | 'lava' | 'powder_snow'): boolean {
  if (c.fluid !== 'empty' && c.level > 0) return false;
  void bucketKind;
  return true;
}

export function afterBucketPoured(
  c: Cauldron,
  bucketKind: 'water' | 'lava' | 'powder_snow',
): Cauldron {
  if (!canPutBucket(c, bucketKind)) return c;
  return { fluid: bucketKind, level: 3 };
}

export function cooksDamage(c: Cauldron): boolean {
  return c.fluid === 'lava' && c.level > 0;
}
