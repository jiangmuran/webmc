// Endermen hold and drop blocks. Only a fixed allowlist is holdable.
//
// Wiki (minecraft.wiki/w/Enderman#Moving_blocks, list of holdable
// blocks). Earlier audits added the dirt family + small flowers
// but missed several Nether-update and post-Wild-update additions:
// mud, muddy_mangrove_roots, moss_block, pale_moss_block, both
// nyliums, both fungi, both root variants, carved_pumpkin, and
// the 1.21.5 cactus_flower.

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
  'carved_pumpkin',
  'melon',
  'tnt',
  'cactus',
  'cactus_flower',
  'mud',
  'muddy_mangrove_roots',
  'moss_block',
  'pale_moss_block',
  'crimson_nylium',
  'warped_nylium',
  'crimson_fungus',
  'warped_fungus',
  'crimson_roots',
  'warped_roots',
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
