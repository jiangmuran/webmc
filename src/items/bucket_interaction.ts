export type BucketKind = 'empty' | 'water' | 'lava' | 'milk' | 'fish' | 'axolotl' | 'powder_snow';

export function canPickUpWater(current: BucketKind): boolean {
  return current === 'empty';
}

export function canPickUpLava(current: BucketKind): boolean {
  return current === 'empty';
}

export function onRightClickOnWater(current: BucketKind): BucketKind {
  return canPickUpWater(current) ? 'water' : current;
}

export function onRightClickOnLava(current: BucketKind): BucketKind {
  return canPickUpLava(current) ? 'lava' : current;
}

// Wiki (minecraft.wiki/w/Bucket): "Using a bucket of water, lava, powder
// snow, fish, or axolotl on a valid target empties the bucket back to
// the player." Old check returned false for fish/axolotl buckets, so
// releasing a captured fish into water silently kept the bucket full.
export function returnsEmptyAfterPlacement(content: BucketKind): boolean {
  return (
    content === 'water' ||
    content === 'lava' ||
    content === 'powder_snow' ||
    content === 'fish' ||
    content === 'axolotl'
  );
}
