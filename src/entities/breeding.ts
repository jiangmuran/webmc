// Animal breeding. Feeding a breed item to two adult animals puts them
// into "love mode"; two animals in love produce one baby + award XP to
// the player who bred them. 5-minute cooldown between breeds.

export type BreedableKind =
  | 'cow'
  | 'pig'
  | 'sheep'
  | 'chicken'
  | 'wolf'
  | 'cat'
  | 'horse'
  | 'donkey'
  | 'rabbit'
  | 'fox'
  | 'panda'
  | 'turtle'
  | 'bee'
  | 'ocelot'
  | 'hoglin'
  | 'strider'
  | 'axolotl'
  | 'frog'
  | 'goat'
  | 'armadillo';

export interface BreedableState {
  kind: BreedableKind;
  isAdult: boolean;
  loveModeSec: number;
  breedCooldownSec: number;
  ageSec: number; // babies grow up over ~20 min
}

export function makeBreedable(kind: BreedableKind, isAdult = true): BreedableState {
  return { kind, isAdult, loveModeSec: 0, breedCooldownSec: 0, ageSec: isAdult ? 1200 : 0 };
}

// Wiki (minecraft.wiki/w/Breeding) per-mob food lists.
//   - Chicken: any of 6 seeds incl. torchflower_seeds + pitcher_pod
//     (1.20 added the latter two; old set only had the original 4).
//   - Wolf: any meat (raw or cooked) EXCEPT fish, plus rabbit_stew
//     and rotten_flesh — 11 items total, NOT only the 3 cooked
//     variants. Old set excluded raw meats and the rotten/stew
//     entries the wiki explicitly calls out.
//   - Bee: any flower; expanded from 4 to the canonical wiki list
//     (small + tall flowers, flowering_azalea, torchflower, wither
//     rose, pitcher plant). Bees still gather from these whether or
//     not they're being bred.
const BREED_ITEMS: Record<BreedableKind, readonly string[]> = {
  cow: ['webmc:wheat'],
  pig: ['webmc:carrot', 'webmc:potato', 'webmc:beetroot'],
  sheep: ['webmc:wheat'],
  chicken: [
    'webmc:wheat_seeds',
    'webmc:melon_seeds',
    'webmc:pumpkin_seeds',
    'webmc:beetroot_seeds',
    'webmc:torchflower_seeds',
    'webmc:pitcher_pod',
  ],
  wolf: [
    'webmc:chicken',
    'webmc:cooked_chicken',
    'webmc:beef',
    'webmc:cooked_beef',
    'webmc:porkchop',
    'webmc:cooked_porkchop',
    'webmc:mutton',
    'webmc:cooked_mutton',
    'webmc:rabbit',
    'webmc:cooked_rabbit',
    'webmc:rabbit_stew',
    'webmc:rotten_flesh',
  ],
  // Wiki (minecraft.wiki/w/Cat + /w/Ocelot): tamed/bred with raw cod
  // and raw salmon. Project canonical (smelting.ts) uses
  // `webmc:cod` / `webmc:salmon` (not the pre-1.13 `raw_fish`).
  cat: ['webmc:cod', 'webmc:salmon'],
  horse: ['webmc:golden_apple', 'webmc:golden_carrot'],
  donkey: ['webmc:golden_apple', 'webmc:golden_carrot'],
  rabbit: ['webmc:dandelion', 'webmc:carrot', 'webmc:golden_carrot'],
  fox: ['webmc:sweet_berries', 'webmc:glow_berries'],
  panda: ['webmc:bamboo'],
  turtle: ['webmc:seagrass'],
  bee: [
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
    'webmc:sunflower',
    'webmc:lilac',
    'webmc:rose_bush',
    'webmc:peony',
    'webmc:pitcher_plant',
    'webmc:flowering_azalea',
  ],
  ocelot: ['webmc:cod', 'webmc:salmon'],
  hoglin: ['webmc:crimson_fungus'],
  strider: ['webmc:warped_fungus'],
  axolotl: ['webmc:tropical_fish_bucket'],
  frog: ['webmc:slime_ball'],
  goat: ['webmc:wheat'],
  armadillo: ['webmc:spider_eye'],
};

export function canBreedWith(state: BreedableState, itemName: string): boolean {
  if (!state.isAdult || state.breedCooldownSec > 0) return false;
  return BREED_ITEMS[state.kind].includes(itemName);
}

export function enterLoveMode(state: BreedableState): boolean {
  if (!state.isAdult || state.breedCooldownSec > 0) return false;
  state.loveModeSec = 30;
  return true;
}

export interface BreedResult {
  produced: boolean;
  babyKind?: BreedableKind;
  xpAwarded: number;
}

export function attemptBreed(a: BreedableState, b: BreedableState): BreedResult {
  if (a.loveModeSec <= 0 || b.loveModeSec <= 0) return { produced: false, xpAwarded: 0 };
  if (a.kind !== b.kind) return { produced: false, xpAwarded: 0 };
  a.loveModeSec = 0;
  b.loveModeSec = 0;
  a.breedCooldownSec = 300;
  b.breedCooldownSec = 300;
  return { produced: true, babyKind: a.kind, xpAwarded: 1 + Math.floor(Math.random() * 7) };
}

export function tickBreedable(state: BreedableState, dtSec: number): void {
  state.loveModeSec = Math.max(0, state.loveModeSec - dtSec);
  state.breedCooldownSec = Math.max(0, state.breedCooldownSec - dtSec);
  state.ageSec += dtSec;
  if (!state.isAdult && state.ageSec >= 1200) state.isAdult = true;
}
