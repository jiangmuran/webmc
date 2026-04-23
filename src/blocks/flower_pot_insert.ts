const ALLOWED = new Set<string>([
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
  'spruce_sapling',
  'birch_sapling',
  'jungle_sapling',
  'acacia_sapling',
  'dark_oak_sapling',
  'mangrove_propagule',
  'cherry_sapling',
  'pale_oak_sapling',
  'azalea',
  'flowering_azalea',
  'fern',
  'dead_bush',
  'cactus',
  'bamboo',
  'warped_roots',
  'crimson_roots',
  'warped_fungus',
  'crimson_fungus',
  'brown_mushroom',
  'red_mushroom',
]);

export function canInsert(pot: { content?: string }, item: string): boolean {
  return pot.content === undefined && ALLOWED.has(item);
}

export function insert(pot: { content?: string }, item: string): { content?: string } {
  return canInsert(pot, item) ? { content: item } : pot;
}

export function takeOut(pot: { content?: string }): {
  newPot: { content?: string };
  dropped?: string;
} {
  if (pot.content === undefined) return { newPot: pot };
  return { newPot: {}, dropped: pot.content };
}
