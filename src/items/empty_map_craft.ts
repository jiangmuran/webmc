export interface Recipe {
  paperSlots: number;
  compassSlots: number;
  useLocator: boolean;
}

// Wiki (minecraft.wiki/w/Map#Crafting):
// - Empty Map: 9 paper in a 3×3 grid (no compass).
// - Empty Locator Map: 8 paper + 1 compass in the center cell.
// Old PAPER_REQUIRED=8 covered both cases, so 8 paper alone (with one
// empty cell) wrongly counted as a craftable plain empty map.
export const PAPER_FOR_PLAIN_MAP = 9;
export const PAPER_FOR_LOCATOR_MAP = 8;
export const COMPASS_REQUIRED = 1;
// Kept for back-compat: equals the plain-map cost (the larger of the two).
export const PAPER_REQUIRED = PAPER_FOR_PLAIN_MAP;

export function canCraftEmptyMap(r: Recipe): boolean {
  const paperNeeded = r.useLocator ? PAPER_FOR_LOCATOR_MAP : PAPER_FOR_PLAIN_MAP;
  if (r.paperSlots < paperNeeded) return false;
  if (r.useLocator && r.compassSlots < COMPASS_REQUIRED) return false;
  return true;
}

export function initialMapScale(): number {
  return 1;
}
