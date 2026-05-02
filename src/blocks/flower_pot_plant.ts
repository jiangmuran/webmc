// Flower pot. Holds a single plant; right-click with a plantable item
// inserts it, right-click empty removes it.
//
// Wiki (minecraft.wiki/w/Flower_Pot): canonical 35+ pottable items.
// Old set was missing torchflower (1.20), pale_oak_sapling (1.21),
// and the eyeblossoms (1.22 pale garden) — three of the most
// recently-added small plants. Aligned with sibling flower_pot.ts.

const POTTABLE = new Set<string>([
  'webmc:oak_sapling',
  'webmc:spruce_sapling',
  'webmc:birch_sapling',
  'webmc:jungle_sapling',
  'webmc:acacia_sapling',
  'webmc:dark_oak_sapling',
  'webmc:mangrove_propagule',
  'webmc:cherry_sapling',
  'webmc:pale_oak_sapling',
  'webmc:fern',
  'webmc:dandelion',
  'webmc:poppy',
  'webmc:blue_orchid',
  'webmc:allium',
  'webmc:azure_bluet',
  'webmc:red_tulip',
  'webmc:orange_tulip',
  'webmc:white_tulip',
  'webmc:pink_tulip',
  'webmc:oxeye_daisy',
  'webmc:cornflower',
  'webmc:lily_of_the_valley',
  'webmc:wither_rose',
  'webmc:torchflower',
  'webmc:closed_eyeblossom',
  'webmc:open_eyeblossom',
  'webmc:cactus',
  'webmc:bamboo',
  'webmc:crimson_fungus',
  'webmc:warped_fungus',
  'webmc:crimson_roots',
  'webmc:warped_roots',
  'webmc:azalea',
  'webmc:flowering_azalea',
  'webmc:dead_bush',
  'webmc:brown_mushroom',
  'webmc:red_mushroom',
]);

export function canPot(itemId: string): boolean {
  return POTTABLE.has(itemId);
}

export interface FlowerPot {
  content: string | null;
}

export function makePot(): FlowerPot {
  return { content: null };
}

export function insert(p: FlowerPot, itemId: string): boolean {
  if (!canPot(itemId)) return false;
  if (p.content !== null) return false;
  p.content = itemId;
  return true;
}

export function remove(p: FlowerPot): string | null {
  const c = p.content;
  p.content = null;
  return c;
}

// Withered rose in a pot gives nearby players wither?? Actually no — pot
// isolates effects. Exposed for clarity.
export function appliesWitherEffect(): boolean {
  return false;
}
