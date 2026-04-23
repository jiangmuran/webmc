export interface PiglinState {
  isInNether: boolean;
  hasGoldenItem: boolean;
  targetHoglin: boolean;
}

export const HUNT_HOGLIN_PRIORITY = 9;

export function shouldHunt(s: PiglinState): boolean {
  if (!s.isInNether) return false;
  return s.targetHoglin;
}

export function ignoresPlayerWearingGold(s: PiglinState): boolean {
  return s.hasGoldenItem;
}
