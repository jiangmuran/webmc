// Drowned trident drops. A drowned may spawn holding a trident; when
// killed, 8.5% chance to drop the trident, +1% per level of Looting,
// capped at 11.5% with Looting III. Drowned holding tridents throw
// them at range.
//
// Wiki (minecraft.wiki/w/Drowned#Drops): "Drowned holding a trident
// have an 8.5% chance to drop it when killed by a player. Looting
// increases this by 1% per level (max 11.5% at Looting III)." Old
// formula `0.085 + lootingLevel * 0.01` had no cap, so Looting V (or
// /enchant 10) kept inflating the chance; sibling
// drowned_trident_drop.ts already caps at 11.5%.

export const TRIDENT_DROP_BASE = 0.085;
export const TRIDENT_DROP_CAP = 0.115;

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
  const chance = Math.min(TRIDENT_DROP_CAP, TRIDENT_DROP_BASE + q.lootingLevel * 0.01);
  return q.rng() < chance;
}

// Thrown trident via drowned: speed 1.4-1.8 m/s toward player.
export function drownedThrowsTrident(state: DrownedState, hasTarget: boolean): boolean {
  return state.holdsTrident && hasTarget;
}
