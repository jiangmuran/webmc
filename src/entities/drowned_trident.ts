// Drowned trident drops. A drowned may spawn holding a trident; when
// killed, 8.5% chance to drop the trident (scaled by looting). Drowned
// holding tridents throw them at range.

export interface DrownedState {
  holdsTrident: boolean;
}

export function makeDrowned(holdsTrident = false): DrownedState {
  return { holdsTrident };
}

export interface DropQuery {
  drownedHoldsTrident: boolean;
  lootingLevel: number;
  rng: () => number;
}

export function drownedTridentDrop(q: DropQuery): boolean {
  if (!q.drownedHoldsTrident) return false;
  const chance = 0.085 + q.lootingLevel * 0.01;
  return q.rng() < chance;
}

// Thrown trident via drowned: speed 1.4-1.8 m/s toward player.
export function drownedThrowsTrident(state: DrownedState, hasTarget: boolean): boolean {
  return state.holdsTrident && hasTarget;
}
