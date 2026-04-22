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

// Feeding helps accelerate growth (MC: golden apple -40% growth time).
const GROW_REDUCTION: Record<string, number> = {
  'webmc:sugar': -0.1,
  'webmc:wheat': -0.05,
  'webmc:apple': -0.15,
  'webmc:hay_block': -0.15,
  'webmc:golden_carrot': -0.3,
  'webmc:golden_apple': -0.4,
};

export function growthReductionOf(item: string): number {
  return GROW_REDUCTION[item] ?? 0;
}
