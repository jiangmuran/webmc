// Footstep sound material table. Maps standing-on block → sound family.

export type FootstepFamily =
  | 'grass'
  | 'stone'
  | 'sand'
  | 'snow'
  | 'wood'
  | 'metal'
  | 'wool'
  | 'gravel'
  | 'water'
  | 'lava'
  | 'soul_sand'
  | 'slime'
  | 'honey'
  | 'powder_snow';

const DEFAULT_STEP: Record<string, FootstepFamily> = {
  grass_block: 'grass',
  dirt: 'grass',
  sand: 'sand',
  gravel: 'gravel',
  stone: 'stone',
  cobblestone: 'stone',
  oak_planks: 'wood',
  iron_block: 'metal',
  white_wool: 'wool',
  snow_block: 'snow',
  water: 'water',
  lava: 'lava',
  soul_sand: 'soul_sand',
  slime_block: 'slime',
  honey_block: 'honey',
  powder_snow: 'powder_snow',
};

export function family(blockId: string): FootstepFamily {
  return DEFAULT_STEP[blockId] ?? 'grass';
}

export function pitchVariance(): number {
  return 0.1; // random jitter per step
}

export function volume(family: FootstepFamily): number {
  if (family === 'wool' || family === 'snow') return 0.5;
  if (family === 'slime' || family === 'honey') return 0.3;
  return 1.0;
}
