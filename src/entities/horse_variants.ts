// Horse color + marking variants. MC has 7 base colors and 5 marking
// patterns (including "none"), so 35 visual variants total. Both
// inherit independently from each parent during breeding.

export type HorseColor =
  | 'white'
  | 'creamy'
  | 'chestnut'
  | 'brown'
  | 'black'
  | 'gray'
  | 'dark_brown';

export type HorseMarking = 'none' | 'stockings' | 'paint' | 'snowflake' | 'sooty';

export const HORSE_COLORS: readonly HorseColor[] = [
  'white',
  'creamy',
  'chestnut',
  'brown',
  'black',
  'gray',
  'dark_brown',
];

export const HORSE_MARKINGS: readonly HorseMarking[] = [
  'none',
  'stockings',
  'paint',
  'snowflake',
  'sooty',
];

export interface HorseVariant {
  color: HorseColor;
  marking: HorseMarking;
}

export function wildHorseVariant(rng: () => number): HorseVariant {
  const color = HORSE_COLORS[Math.floor(rng() * HORSE_COLORS.length)] ?? 'white';
  const marking = HORSE_MARKINGS[Math.floor(rng() * HORSE_MARKINGS.length)] ?? 'none';
  return { color, marking };
}

export interface BreedingQuery {
  parentA: HorseVariant;
  parentB: HorseVariant;
  rng: () => number;
}

// Child inherits each trait independently 50/50, with a ~15% chance of
// random mutation (new variant not shared by parents).
export function breedHorseVariant(q: BreedingQuery): HorseVariant {
  const mutationChance = 0.15;
  const color =
    q.rng() < mutationChance
      ? wildHorseVariant(q.rng).color
      : q.rng() < 0.5
        ? q.parentA.color
        : q.parentB.color;
  const marking =
    q.rng() < mutationChance
      ? wildHorseVariant(q.rng).marking
      : q.rng() < 0.5
        ? q.parentA.marking
        : q.parentB.marking;
  return { color, marking };
}

// Convert a variant to a single texture id.
export function variantTextureId(v: HorseVariant): string {
  return `webmc:horse_${v.color}_${v.marking}`;
}

// Baby horses take ~20 MC minutes to grow to adult.
export const HORSE_GROW_TICKS = 24_000;

// Wiki (minecraft.wiki/w/Horse#Growth): feeding babies subtracts a
// fixed wall-clock time from growth, not a percentage. Total growth
// is 20 min (24000 ticks); reductions in minutes:
//   sugar 30s, wheat 20s, apple 1m, golden_carrot 1m,
//   golden_apple 4m, hay_block (bale) 3m, bread 1m.
// Old % multipliers were too aggressive (sugar -10% ≈ 2 min, golden
// apple -40% ≈ 8 min). Now values are share-of-20-minutes.
const GROW_REDUCTION: Record<string, number> = {
  'webmc:sugar': -30 / 1200, // -30s
  'webmc:wheat': -20 / 1200, // -20s
  'webmc:apple': -60 / 1200, // -1 min
  'webmc:bread': -60 / 1200,
  'webmc:hay_block': -180 / 1200, // -3 min
  'webmc:golden_carrot': -60 / 1200, // -1 min
  'webmc:golden_apple': -240 / 1200, // -4 min
};

export function growthReductionOf(item: string): number {
  return GROW_REDUCTION[item] ?? 0;
}
