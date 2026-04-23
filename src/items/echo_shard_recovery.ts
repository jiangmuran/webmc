export interface CraftInput {
  compassSlots: number;
  echoShardSlots: number;
}

export const RECIPE_COMPASS = 1;
export const RECIPE_ECHO_SHARDS = 8;

export function canCraftRecoveryCompass(c: CraftInput): boolean {
  return c.compassSlots >= RECIPE_COMPASS && c.echoShardSlots >= RECIPE_ECHO_SHARDS;
}

export function echoShardFoundInAncientCity(): boolean {
  return true;
}
