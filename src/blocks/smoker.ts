// Smoker — food-only furnace that runs 2× speed. Reuses the smelting
// recipes but only those whose input is food.

import { findRecipe, type SmeltingRecipe } from '@/items/smelting';

const FOOD_INPUT_PREFIXES = ['webmc:raw_', 'webmc:potato', 'webmc:kelp'];

export function isSmokerInput(inputName: string): boolean {
  for (const p of FOOD_INPUT_PREFIXES) if (inputName.startsWith(p)) return true;
  return false;
}

export function smokerRecipeFor(inputName: string): SmeltingRecipe | null {
  if (!isSmokerInput(inputName)) return null;
  const recipe = findRecipe(inputName);
  if (!recipe) return null;
  return { ...recipe, cookSec: recipe.cookSec / 2 };
}
