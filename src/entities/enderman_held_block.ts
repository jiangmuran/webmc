// Endermen hold and drop blocks. Only a fixed allowlist is holdable.
//
// Wiki (minecraft.wiki/w/Enderman): the canonical #enderman_holdable
// tag covers the dirt family + sand/red_sand/gravel/clay + pumpkin/
// melon/cactus/TNT + both mushrooms + every small flower. Old set
// only had dandelion+poppy among flowers and was missing podzol,
// coarse_dirt, rooted_dirt, and 12 other small flowers.

export const HELD_BLOCK_WHITELIST = new Set([
  'grass_block',
  'dirt',
  'coarse_dirt',
  'rooted_dirt',
  'podzol',
  'mycelium',
  'sand',
  'red_sand',
  'gravel',
  'clay',
  'brown_mushroom',
  'red_mushroom',
  'pumpkin',
  'melon',
  'tnt',
  'cactus',
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
]);

export function canPickUp(blockId: string): boolean {
  return HELD_BLOCK_WHITELIST.has(blockId);
}

export function onDeath(held: string | null): string | null {
  return held;
}

export function mayPlace(heldBlock: string | null, targetIsAir: boolean): boolean {
  return heldBlock !== null && targetIsAir;
}
