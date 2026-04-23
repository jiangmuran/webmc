// Feeding a dolphin raw fish makes it lead the player to the nearest
// shipwreck or ocean ruin. Boosts swimming near the player.

export const LEAD_DISTANCE_MAX = 256;

export interface FeedCtx {
  fishesFed: number;
  isSwimming: boolean;
  nearestStructureDistance: number | null;
}

export function willLead(c: FeedCtx): boolean {
  return (
    c.fishesFed > 0 &&
    c.nearestStructureDistance !== null &&
    c.nearestStructureDistance <= LEAD_DISTANCE_MAX
  );
}

export function swimBoostActive(c: FeedCtx, playerDistance: number): boolean {
  if (!c.isSwimming) return false;
  return playerDistance <= 5;
}

export const DOLPHIN_ACCEPTED_FOODS = new Set(['cod', 'salmon', 'tropical_fish', 'pufferfish']);

export function accepts(food: string): boolean {
  return DOLPHIN_ACCEPTED_FOODS.has(food);
}
