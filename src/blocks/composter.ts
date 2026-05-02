// Composter — a decay-level 0..7 block that produces 1 bone meal when full.
// Adding an organic item has a per-item chance to raise the decay level.

export interface ComposterState {
  level: number; // 0..8 where 8 = ready to harvest
}

const FULL_LEVEL = 8;

export function makeComposter(): ComposterState {
  return { level: 0 };
}

// Wiki (minecraft.wiki/w/Composter): per-item compost chances, broken
// into 5 tiers (30 / 50 / 65 / 85 / 100 %). Old table covered ~27
// items — Nether (nether_wart, twisting/weeping vines, crimson/warped
// roots, shroomlight), lush cave (glow_berries, moss_block, moss_carpet,
// dripleaves), taiga (sweet_berries), mangrove (propagule, roots),
// non-oak saplings/leaves, and mushrooms were all missing. Composters
// silently rejected them, breaking automated farms that relied on
// e.g. wart→bone-meal or moss-carpet→bone-meal cycles.
export const COMPOST_CHANCE: Record<string, number> = {
  // 30%
  'webmc:wheat_seeds': 0.3,
  'webmc:melon_seeds': 0.3,
  'webmc:pumpkin_seeds': 0.3,
  'webmc:beetroot_seeds': 0.3,
  'webmc:torchflower_seeds': 0.3,
  'webmc:pitcher_pod': 0.3,
  'webmc:dried_kelp': 0.3,
  'webmc:kelp': 0.3,
  'webmc:seagrass': 0.3,
  'webmc:grass': 0.3,
  'webmc:short_grass': 0.3,
  'webmc:hanging_roots': 0.3,
  'webmc:moss_carpet': 0.3,
  'webmc:pale_moss_carpet': 0.3,
  'webmc:pale_hanging_moss': 0.3,
  'webmc:pink_petals': 0.3,
  'webmc:small_dripleaf': 0.3,
  'webmc:sweet_berries': 0.3,
  'webmc:glow_berries': 0.3,
  'webmc:mangrove_roots': 0.3,
  'webmc:mangrove_propagule': 0.3,
  'webmc:leaf_litter': 0.3,
  'webmc:wildflowers': 0.3,
  'webmc:cactus_flower': 0.3,
  'webmc:firefly_bush': 0.3,
  'webmc:bush': 0.3,
  'webmc:short_dry_grass': 0.3,
  'webmc:tall_dry_grass': 0.3,
  // Saplings (all species)
  'webmc:oak_sapling': 0.3,
  'webmc:spruce_sapling': 0.3,
  'webmc:birch_sapling': 0.3,
  'webmc:jungle_sapling': 0.3,
  'webmc:acacia_sapling': 0.3,
  'webmc:dark_oak_sapling': 0.3,
  'webmc:cherry_sapling': 0.3,
  'webmc:pale_oak_sapling': 0.3,
  // Leaves (all species)
  'webmc:oak_leaves': 0.3,
  'webmc:spruce_leaves': 0.3,
  'webmc:birch_leaves': 0.3,
  'webmc:jungle_leaves': 0.3,
  'webmc:acacia_leaves': 0.3,
  'webmc:dark_oak_leaves': 0.3,
  'webmc:cherry_leaves': 0.3,
  'webmc:mangrove_leaves': 0.3,
  'webmc:pale_oak_leaves': 0.3,
  'webmc:azalea_leaves': 0.3,

  // 50%
  'webmc:cactus': 0.5,
  'webmc:sugar_cane': 0.5,
  'webmc:vine': 0.5,
  'webmc:melon_slice': 0.5,
  'webmc:tall_grass': 0.5,
  'webmc:dried_kelp_block': 0.5,
  'webmc:flowering_azalea_leaves': 0.5,
  'webmc:glow_lichen': 0.5,
  'webmc:nether_sprouts': 0.5,
  'webmc:twisting_vines': 0.5,
  'webmc:weeping_vines': 0.5,

  // 65%
  'webmc:sea_pickle': 0.65,
  'webmc:lily_pad': 0.65,
  'webmc:pumpkin': 0.65,
  'webmc:melon': 0.65,
  'webmc:wheat': 0.65,
  'webmc:carrot': 0.65,
  'webmc:potato': 0.65,
  'webmc:beetroot': 0.65,
  'webmc:apple': 0.65,
  'webmc:cocoa_beans': 0.65,
  'webmc:nether_wart': 0.65,
  'webmc:big_dripleaf': 0.65,
  'webmc:fern': 0.65,
  'webmc:large_fern': 0.65,
  'webmc:moss_block': 0.65,
  'webmc:pale_moss_block': 0.65,
  'webmc:azalea': 0.65,
  'webmc:carved_pumpkin': 0.65,
  'webmc:crimson_roots': 0.65,
  'webmc:warped_roots': 0.65,
  'webmc:shroomlight': 0.65,
  'webmc:spore_blossom': 0.65,
  'webmc:wither_rose': 0.65,
  'webmc:brown_mushroom': 0.65,
  'webmc:red_mushroom': 0.65,
  'webmc:crimson_fungus': 0.65,
  'webmc:warped_fungus': 0.65,
  'webmc:mushroom_stem': 0.65,

  // 85%
  'webmc:hay_block': 0.85,
  'webmc:bread': 0.85,
  'webmc:baked_potato': 0.85,
  'webmc:cookie': 0.85,
  'webmc:flowering_azalea': 0.85,
  'webmc:nether_wart_block': 0.85,
  'webmc:warped_wart_block': 0.85,
  'webmc:pitcher_plant': 0.85,
  'webmc:torchflower': 0.85,
  'webmc:brown_mushroom_block': 0.85,
  'webmc:red_mushroom_block': 0.85,

  // 100%
  'webmc:pumpkin_pie': 1.0,
  'webmc:cake': 1.0,
};

export function composterChance(itemName: string): number {
  return COMPOST_CHANCE[itemName] ?? 0;
}

export interface InsertResult {
  accepted: boolean;
  leveledUp: boolean;
}

// Wiki (minecraft.wiki/w/Composter): "When the composter is empty,
// any compostable item added always creates the first layer of
// compost, regardless of its usual composting chance." Old code
// rolled the per-item chance even at level 0, so a wheat-seed
// (30%) would fail 70% of the time on an empty composter even
// though canon says it should always succeed. MC-196452 confirms
// this is intended behaviour, not a bug.
export function insertIntoComposter(
  state: ComposterState,
  itemName: string,
  rng: () => number = Math.random,
): InsertResult {
  if (state.level >= FULL_LEVEL) return { accepted: false, leveledUp: false };
  const chance = composterChance(itemName);
  if (chance <= 0) return { accepted: false, leveledUp: false };
  // Empty composter: first compostable item ALWAYS creates layer 1.
  if (state.level === 0) {
    state.level = 1;
    return { accepted: true, leveledUp: true };
  }
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
