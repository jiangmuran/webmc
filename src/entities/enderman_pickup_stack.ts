// Enderman block-carrying. Endermen can pick up a specific whitelist
// of blocks and carry exactly one. They drop it when hurt or randomly.

// Wiki (minecraft.wiki/w/Enderman): the canonical #enderman_holdable
// tag is dirt-family blocks + sand/red_sand/gravel/clay + pumpkin/
// melon/cactus/TNT + brown/red mushroom + every small flower. Old
// set used the imaginary `webmc:flower` ID (no such block) and was
// missing coarse_dirt, rooted_dirt, the two mushrooms, and the
// canonical small-flower IDs. Aligned with sibling
// enderman_pickup.ts and enderman_held_block.ts.
const PICKUP_WHITELIST = new Set<string>([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:coarse_dirt',
  'webmc:rooted_dirt',
  'webmc:sand',
  'webmc:red_sand',
  'webmc:gravel',
  'webmc:clay',
  'webmc:mycelium',
  'webmc:podzol',
  'webmc:tnt',
  'webmc:cactus',
  'webmc:pumpkin',
  'webmc:melon',
  'webmc:brown_mushroom',
  'webmc:red_mushroom',
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
]);

export function canPickUp(blockId: string): boolean {
  return PICKUP_WHITELIST.has(blockId);
}

export interface EndermanCarry {
  held: string | null;
}

export function tryPickup(state: EndermanCarry, blockId: string): boolean {
  if (state.held !== null) return false;
  if (!canPickUp(blockId)) return false;
  state.held = blockId;
  return true;
}

export function dropHeld(state: EndermanCarry): string | null {
  const b = state.held;
  state.held = null;
  return b;
}
