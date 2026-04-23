export interface BeeCtx {
  hasPollen: boolean;
  nearbyFlowerBlock?: string;
  nearbyHive?: boolean;
}

export const FLOWERS = new Set([
  'dandelion',
  'poppy',
  'torchflower',
  'sunflower',
  'rose_bush',
  'allium',
  'blue_orchid',
  'cornflower',
  'lily_of_the_valley',
  'oxeye_daisy',
]);

export function wantsToVisitFlower(b: BeeCtx): boolean {
  return !b.hasPollen && b.nearbyFlowerBlock !== undefined && FLOWERS.has(b.nearbyFlowerBlock);
}

export function wantsToReturnHome(b: BeeCtx): boolean {
  return b.hasPollen && b.nearbyHive === true;
}
