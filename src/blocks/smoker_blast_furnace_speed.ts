export const FURNACE_SMELT_TICKS = 200;
export const BLAST_FURNACE_SMELT_TICKS = 100;
export const SMOKER_SMELT_TICKS = 100;

export type SmeltType = 'furnace' | 'blast_furnace' | 'smoker';

export function smeltTicksFor(kind: SmeltType): number {
  if (kind === 'blast_furnace') return BLAST_FURNACE_SMELT_TICKS;
  if (kind === 'smoker') return SMOKER_SMELT_TICKS;
  return FURNACE_SMELT_TICKS;
}

const BLAST_FURNACE_RECIPES = new Set([
  'iron_ore',
  'gold_ore',
  'ancient_debris',
  'iron_ingot',
  'gold_ingot',
]);
const SMOKER_RECIPES = new Set([
  'beef',
  'porkchop',
  'chicken',
  'mutton',
  'rabbit',
  'cod',
  'salmon',
  'potato',
]);

export function canSmelt(kind: SmeltType, item: string): boolean {
  if (kind === 'blast_furnace') return BLAST_FURNACE_RECIPES.has(item);
  if (kind === 'smoker') return SMOKER_RECIPES.has(item);
  return true;
}
