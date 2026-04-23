// Endermen hold and drop blocks. Only a fixed allowlist is holdable.

export const HELD_BLOCK_WHITELIST = new Set([
  'grass_block',
  'dirt',
  'sand',
  'red_sand',
  'clay',
  'mycelium',
  'gravel',
  'brown_mushroom',
  'red_mushroom',
  'pumpkin',
  'melon',
  'tnt',
  'cactus',
  'dandelion',
  'poppy',
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
