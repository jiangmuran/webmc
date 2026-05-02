// Enderman pickup mechanic. An enderman carries one block at a time;
// picks up if it wanders onto a random "carryable" block; places when
// it teleports.
//
// Wiki (minecraft.wiki/w/Enderman): the canonical #enderman_holdable
// tag is dirt-family blocks + sand/red_sand/gravel/clay + pumpkin/
// melon/cactus/TNT + brown/red mushroom + every small flower. Old set
// included non-vanilla items (netherrack, oak_log, dirt_path, mud,
// the imaginary `flower_red` / `flower_yellow` IDs) and missed
// red_sand, both mushrooms, and the canonical flower IDs.

const CARRYABLE = new Set<string>([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:coarse_dirt',
  'webmc:rooted_dirt',
  'webmc:gravel',
  'webmc:sand',
  'webmc:red_sand',
  'webmc:clay',
  'webmc:mycelium',
  'webmc:podzol',
  'webmc:pumpkin',
  'webmc:melon',
  'webmc:cactus',
  'webmc:tnt',
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

export interface EndermanPickupState {
  carrying: string | null;
}

export function makeEndermanPickup(): EndermanPickupState {
  return { carrying: null };
}

export function canPickup(blockName: string): boolean {
  return CARRYABLE.has(blockName);
}

export interface PickupResult {
  picked: boolean;
}

// Wiki (minecraft.wiki/w/Enderman): "Every tick, an enderman has a
// 1/20 (5%) chance to select a random block ... If the enderman can
// directly see this block and the block is on the 'holdable' list,
// it picks up the block." Old 0.03 was 40% under wiki canon.
export const PICKUP_CHANCE_PER_TICK = 1 / 20;

export function tryPickup(
  state: EndermanPickupState,
  blockName: string,
  rng: () => number = Math.random,
): PickupResult {
  if (state.carrying !== null) return { picked: false };
  if (!canPickup(blockName)) return { picked: false };
  if (rng() < PICKUP_CHANCE_PER_TICK) {
    state.carrying = blockName;
    return { picked: true };
  }
  return { picked: false };
}

export interface PlaceResult {
  placed: boolean;
  placedBlock: string | null;
}

// Wiki (minecraft.wiki/w/Enderman): "While an enderman is carrying a
// block, it has a 1/2000 (0.05%) chance every tick to silently place
// the block in a 2×2×2 region." Old 0.05 (5%) was 100× wiki — a
// carrying enderman placed its held block almost every second instead
// of roughly once per 100 seconds. The whole "rare structure
// modification" character of enderman block-moving was lost.
export const PLACE_CHANCE_PER_TICK = 1 / 2000;

export function tryPlace(state: EndermanPickupState, rng: () => number = Math.random): PlaceResult {
  if (state.carrying === null) return { placed: false, placedBlock: null };
  if (rng() < PLACE_CHANCE_PER_TICK) {
    const placed = state.carrying;
    state.carrying = null;
    return { placed: true, placedBlock: placed };
  }
  return { placed: false, placedBlock: null };
}
