export const PICKUPABLE_BLOCKS = new Set([
  'grass_block',
  'dirt',
  'sand',
  'red_sand',
  'gravel',
  'clay',
  'podzol',
  'mycelium',
  'pumpkin',
  'carved_pumpkin',
  'melon',
  'cactus',
  'tnt',
  'dandelion',
  'poppy',
  'mushroom',
  'brown_mushroom',
  'red_mushroom',
]);

export function canPickUp(block: string): boolean {
  return PICKUPABLE_BLOCKS.has(block);
}

export function pickupTicks(): number {
  return 600;
}

export function dropsOnDeath(held?: string): string | undefined {
  return held;
}
