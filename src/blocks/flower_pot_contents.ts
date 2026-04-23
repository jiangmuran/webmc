export const POTTABLE = new Set([
  'dandelion',
  'poppy',
  'blue_orchid',
  'allium',
  'azure_bluet',
  'red_tulip',
  'orange_tulip',
  'white_tulip',
  'pink_tulip',
  'oxeye_daisy',
  'cornflower',
  'lily_of_the_valley',
  'wither_rose',
  'torchflower',
  'open_eyeblossom',
  'closed_eyeblossom',
  'oak_sapling',
  'cactus',
  'bamboo',
  'fern',
  'dead_bush',
  'red_mushroom',
  'brown_mushroom',
]);

export function canPot(item: string): boolean {
  return POTTABLE.has(item);
}

export function potResultName(item: string): string | undefined {
  return canPot(item) ? `potted_${item}` : undefined;
}

export function emptyPotYields(): string {
  return 'flower_pot';
}
