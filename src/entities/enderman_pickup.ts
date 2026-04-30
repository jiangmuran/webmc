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

export function tryPickup(
  state: EndermanPickupState,
  blockName: string,
  rng: () => number = Math.random,
): PickupResult {
  if (state.carrying !== null) return { picked: false };
  if (!canPickup(blockName)) return { picked: false };
  if (rng() < 0.03) {
    state.carrying = blockName;
    return { picked: true };
  }
  return { picked: false };
}

export interface PlaceResult {
  placed: boolean;
  placedBlock: string | null;
}

export function tryPlace(state: EndermanPickupState, rng: () => number = Math.random): PlaceResult {
  if (state.carrying === null) return { placed: false, placedBlock: null };
  if (rng() < 0.05) {
    const placed = state.carrying;
    state.carrying = null;
    return { placed: true, placedBlock: placed };
  }
  return { placed: false, placedBlock: null };
}
