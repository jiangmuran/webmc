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

export function returnsEmptyAfterPlacement(content: BucketKind): boolean {
  return content === 'water' || content === 'lava' || content === 'powder_snow';
}
