// Flower pot. Holds one plant at a time (flower, sapling, fern, dead
// bush, mushroom, cactus, bamboo, torchflower). Right-click with empty
// hand extracts the plant; right-click with a valid plant inserts it.

const POTTABLE = new Set<string>([
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
  'webmc:oak_sapling',
  'webmc:spruce_sapling',
  'webmc:birch_sapling',
  'webmc:jungle_sapling',
  'webmc:acacia_sapling',
  'webmc:dark_oak_sapling',
  'webmc:cherry_sapling',
  'webmc:mangrove_propagule',
  'webmc:pale_oak_sapling',
  'webmc:fern',
  'webmc:dead_bush',
  'webmc:brown_mushroom',
  'webmc:red_mushroom',
  'webmc:cactus',
  'webmc:bamboo',
  'webmc:crimson_fungus',
  'webmc:warped_fungus',
  'webmc:crimson_roots',
  'webmc:warped_roots',
  'webmc:azalea',
  'webmc:flowering_azalea',
  'webmc:closed_eyeblossom',
  'webmc:open_eyeblossom',
]);

export interface FlowerPotState {
  content: string | null;
}

export function makeFlowerPot(content: string | null = null): FlowerPotState {
  return { content };
}

export interface InteractQuery {
  pot: FlowerPotState;
  heldItem: string | null;
}

export interface InteractResult {
  consumedHeld: boolean;
  yieldedPlant: string | null;
  changed: boolean;
}

export function interactPot(q: InteractQuery): InteractResult {
  if (q.heldItem === null) {
    if (q.pot.content === null) return { consumedHeld: false, yieldedPlant: null, changed: false };
    const plant = q.pot.content;
    q.pot.content = null;
    return { consumedHeld: false, yieldedPlant: plant, changed: true };
  }
  if (q.pot.content !== null) {
    return { consumedHeld: false, yieldedPlant: null, changed: false };
  }
  if (!POTTABLE.has(q.heldItem)) {
    return { consumedHeld: false, yieldedPlant: null, changed: false };
  }
  q.pot.content = q.heldItem;
  return { consumedHeld: true, yieldedPlant: null, changed: true };
}

export function isPottable(item: string): boolean {
  return POTTABLE.has(item);
}

// Break drops: the pot itself + any content.
export function breakPot(pot: FlowerPotState): { item: string; count: number }[] {
  const drops: { item: string; count: number }[] = [{ item: 'webmc:flower_pot', count: 1 }];
  if (pot.content !== null) drops.push({ item: pot.content, count: 1 });
  return drops;
}
