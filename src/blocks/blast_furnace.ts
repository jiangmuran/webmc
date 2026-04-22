// Blast furnace — ore-only furnace that runs 2× speed. Accepts ores and
// some armor-related items (iron chestplate → iron ingot).

import { findRecipe, type SmeltingRecipe } from '@/items/smelting';

const BLAST_INPUT_SUBSTRINGS = ['_ore', '_ingot_recoverable', 'chain'];

export function isBlastFurnaceInput(inputName: string): boolean {
  for (const p of BLAST_INPUT_SUBSTRINGS) if (inputName.includes(p)) return true;
  return false;
}

export function blastFurnaceRecipeFor(inputName: string): SmeltingRecipe | null {
  if (!isBlastFurnaceInput(inputName)) return null;
  const recipe = findRecipe(inputName);
  if (!recipe) return null;
  return { ...recipe, cookSec: recipe.cookSec / 2 };
}
