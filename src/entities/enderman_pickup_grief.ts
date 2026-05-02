// Wiki: enderman holdable list — grass/dirt-family + sand-family +
// pumpkin (uncarved) + melon/cactus/TNT + brown/red mushroom + every
// single-block flower. Old set had `carved_pumpkin` (not pickupable —
// only uncarved pumpkin is) and `mushroom` (not a real block id), and
// missed most flowers besides dandelion + poppy.
export const PICKUPABLE_BLOCKS = new Set([
  'grass_block',
  'dirt',
  'podzol',
  'mycelium',
  'sand',
  'red_sand',
  'gravel',
  'clay',
  'pumpkin',
  'melon',
  'cactus',
  'tnt',
  'brown_mushroom',
  'red_mushroom',
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
