// Fletching table: fletcher villager workstation. No GUI recipes;
// its sole function is acting as the profession POI and emitting
// chisel sounds when used.

export interface FletchingInteract {
  wasVillagerNearby: boolean;
  hasFletcherProfession: boolean;
}

export function claimsAsPoi(): boolean {
  return true;
}

export function profession(): string {
  return 'fletcher';
}

export function useGivesRecipe(): boolean {
  return false;
}

export const FLETCHER_WORK_SOUND = 'block.fletching_table.use';
