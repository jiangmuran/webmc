// Composter — a decay-level 0..7 block that produces 1 bone meal when full.
// Adding an organic item has a per-item chance to raise the decay level.

export interface ComposterState {
  level: number; // 0..8 where 8 = ready to harvest
}

const FULL_LEVEL = 8;

export function makeComposter(): ComposterState {
  return { level: 0 };
}

// Chance of raising level 0-1 per successful insert. MC uses per-item
// chances e.g. seeds 30%, wheat 65%, bread 85%, cake 100%.
export const COMPOST_CHANCE: Record<string, number> = {
  'webmc:wheat_seeds': 0.3,
  'webmc:oak_leaves': 0.3,
  'webmc:oak_sapling': 0.3,
  'webmc:melon_seeds': 0.3,
  'webmc:pumpkin_seeds': 0.3,
  'webmc:beetroot_seeds': 0.3,
  'webmc:dried_kelp': 0.3,
  'webmc:grass': 0.3,
  'webmc:kelp': 0.3,
  'webmc:cactus': 0.5,
  'webmc:sugar_cane': 0.5,
  'webmc:vine': 0.5,
  'webmc:melon_slice': 0.5,
  'webmc:tall_grass': 0.5,
  'webmc:sea_pickle': 0.65,
  'webmc:lily_pad': 0.65,
  'webmc:pumpkin': 0.65,
  'webmc:melon': 0.65,
  'webmc:wheat': 0.65,
  'webmc:carrot': 0.65,
  'webmc:potato': 0.65,
  'webmc:beetroot': 0.65,
  'webmc:apple': 0.65,
  'webmc:hay_block': 0.85,
  'webmc:bread': 0.85,
  'webmc:baked_potato': 0.85,
  'webmc:pumpkin_pie': 1.0,
  'webmc:cake': 1.0,
  'webmc:cookie': 0.85,
};

export function composterChance(itemName: string): number {
  return COMPOST_CHANCE[itemName] ?? 0;
}

export interface InsertResult {
  accepted: boolean;
  leveledUp: boolean;
}

export function insertIntoComposter(
  state: ComposterState,
  itemName: string,
  rng: () => number = Math.random,
): InsertResult {
  if (state.level >= FULL_LEVEL) return { accepted: false, leveledUp: false };
  const chance = composterChance(itemName);
  if (chance <= 0) return { accepted: false, leveledUp: false };
  if (rng() < chance) {
    state.level++;
    return { accepted: true, leveledUp: true };
  }
  return { accepted: true, leveledUp: false };
}

// Harvest: full composter yields 1 bone meal, resets to level 0.
export function harvestComposter(state: ComposterState): string | null {
  if (state.level < FULL_LEVEL) return null;
  state.level = 0;
  return 'webmc:bone_meal';
}
