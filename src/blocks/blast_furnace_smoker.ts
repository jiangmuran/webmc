// Blast furnace and smoker. Each is 2x faster than a plain furnace
// but restricted to a subset of recipes.

export type FurnaceKind = 'furnace' | 'blast_furnace' | 'smoker';

export const FURNACE_COOK_TICKS = 200;

export function cookTicks(kind: FurnaceKind): number {
  return kind === 'furnace' ? FURNACE_COOK_TICKS : FURNACE_COOK_TICKS / 2;
}

export function acceptsInput(kind: FurnaceKind, recipeCategory: 'ore' | 'food' | 'misc'): boolean {
  if (kind === 'blast_furnace') return recipeCategory === 'ore';
  if (kind === 'smoker') return recipeCategory === 'food';
  return true;
}

export function xpEmittedMultiplier(_kind: FurnaceKind): number {
  // Blast/smoker emit the same XP as furnace; speed is the only advantage.
  return 1;
}
