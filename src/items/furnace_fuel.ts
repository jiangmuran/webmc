// Furnace fuel burn times (seconds). Each item provides `seconds` of
// burn time; one smelt takes 10 seconds (200 ticks).
//
// Wiki (minecraft.wiki/w/Fuel#Furnace) — canonical Java table:
//   coal/charcoal:        80 s   (8 smelts)
//   block of coal:       800 s
//   dried_kelp_block:    200 s
//   lava_bucket:        1000 s
//   blaze_rod:           120 s
//   stick:                 5 s
//   bamboo:                2.5 s
//   scaffolding:           2.5 s   (was 2 — off by 0.5)
//   any wood-family planks/log/wood/hyphae/stem/stairs/fence/etc:
//     1.5 smelts = 15 s; slabs are 0.75 = 7.5 s
//   wood saplings/buttons/wool: 0.5 = 5 s
//   wood doors:                  1 = 10 s
//   carpet (any color):          0.335 = 3.35 s
//
// Old explicit table only covered `oak_*` entries — every non-oak
// wood (spruce_log, birch_planks, mangrove_stairs, etc.) was treated
// as non-fuel. Now uses an explicit table for non-wood items plus
// suffix/family rules so all wood/wool/carpet types burn per wiki.
export const BURN_TIMES: Record<string, number> = {
  'webmc:coal': 80,
  'webmc:charcoal': 80,
  'webmc:coal_block': 800,
  'webmc:dried_kelp_block': 200,
  'webmc:lava_bucket': 1000,
  'webmc:blaze_rod': 120,
  'webmc:stick': 5,
  'webmc:bamboo': 2.5,
  // Wiki: scaffolding = 0.25 smelts = 2.5 s (was 2 — off by 0.5).
  'webmc:scaffolding': 2.5,
  'webmc:crafting_table': 15,
  'webmc:ladder': 15,
  'webmc:bowl': 5,
  'webmc:fishing_rod': 15,
  'webmc:bookshelf': 15,
  'webmc:chiseled_bookshelf': 15,
  'webmc:lectern': 15,
  'webmc:cartography_table': 15,
  'webmc:fletching_table': 15,
  'webmc:smithing_table': 15,
  'webmc:loom': 15,
  'webmc:composter': 15,
  'webmc:barrel': 15,
  'webmc:chest': 15,
  'webmc:trapped_chest': 15,
  'webmc:daylight_detector': 15,
  'webmc:jukebox': 15,
  'webmc:note_block': 15,
  'webmc:bee_nest': 15,
  'webmc:beehive': 15,
};

const WOOD_SUFFIXES = [
  '_planks',
  '_log',
  '_wood',
  '_hyphae',
  '_stem',
  '_stairs',
  '_fence',
  '_fence_gate',
  '_pressure_plate',
  '_trapdoor',
  '_sign',
  '_hanging_sign',
  '_banner',
];

function isWoodyId(stripped: string): boolean {
  return /(_oak|spruce|birch|jungle|acacia|dark_oak|mangrove|cherry|pale_oak|crimson|warped|bamboo)/.test(
    stripped,
  );
}

// Wood-family burn-time classifier per #minecraft:logs + related
// tags. Suffix-based so all wood types work without per-tree entries.
function woodFamilyBurnSec(id: string): number | undefined {
  const stripped = id.replace(/^webmc:/, '');
  // Sapling (any wood) = 0.5 smelts = 5 s
  if (stripped.endsWith('_sapling')) return 5;
  // Wooden buttons = 0.5 = 5 s — exclude stone/polished/etc.
  if (stripped.endsWith('_button') && isWoodyId(stripped)) return 5;
  // Wooden doors = 1 smelt = 10 s
  if (stripped.endsWith('_door') && isWoodyId(stripped)) return 10;
  // Wooden slabs = 0.75 smelts = 7.5 s
  if (stripped.endsWith('_slab') && isWoodyId(stripped)) return 7.5;
  for (const suffix of WOOD_SUFFIXES) {
    if (stripped.endsWith(suffix)) return 15;
  }
  if (stripped === 'bamboo_block' || stripped === 'stripped_bamboo_block') return 15;
  return undefined;
}

const COLORS = [
  'white',
  'orange',
  'magenta',
  'light_blue',
  'yellow',
  'lime',
  'pink',
  'gray',
  'light_gray',
  'cyan',
  'purple',
  'blue',
  'brown',
  'green',
  'red',
  'black',
];

function isColoredWool(stripped: string): boolean {
  if (stripped === 'wool') return true;
  return COLORS.some((c) => stripped === `${c}_wool` || stripped === `wool_${c}`);
}

function isCarpet(stripped: string): boolean {
  if (stripped === 'carpet') return true;
  return COLORS.some((c) => stripped === `${c}_carpet` || stripped === `carpet_${c}`);
}

export const SMELT_DURATION_SEC = 10;

export function burnSecondsFor(item: string): number {
  const explicit = BURN_TIMES[item];
  if (explicit !== undefined) return explicit;
  const wood = woodFamilyBurnSec(item);
  if (wood !== undefined) return wood;
  const stripped = item.replace(/^webmc:/, '');
  if (isColoredWool(stripped)) return 5;
  if (isCarpet(stripped)) return 3.35; // wiki: 67 ticks
  return 0;
}

// How many smelt operations one unit of a fuel will power.
export function smeltsPerUnit(item: string): number {
  return burnSecondsFor(item) / SMELT_DURATION_SEC;
}

export function isFuel(item: string): boolean {
  return burnSecondsFor(item) > 0;
}

// A burning furnace state: seconds remaining.
export interface FurnaceBurnState {
  burnSecondsRemaining: number;
  maxBurnSeconds: number;
}

export function makeBurn(): FurnaceBurnState {
  return { burnSecondsRemaining: 0, maxBurnSeconds: 0 };
}

// Light the furnace using one unit of fuel. Returns true if the fuel was
// consumed; false if the furnace is already burning or item is not fuel.
export function igniteFurnace(state: FurnaceBurnState, fuel: string): boolean {
  if (state.burnSecondsRemaining > 0) return false;
  const sec = burnSecondsFor(fuel);
  if (sec <= 0) return false;
  state.burnSecondsRemaining = sec;
  state.maxBurnSeconds = sec;
  return true;
}

export function tickBurn(state: FurnaceBurnState, dtSec: number): void {
  state.burnSecondsRemaining = Math.max(0, state.burnSecondsRemaining - dtSec);
}
