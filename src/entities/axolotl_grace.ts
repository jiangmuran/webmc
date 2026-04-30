export interface PlayerWithAxolotl {
  axolotlDamagedMobNearby: boolean;
  lastDamageAtTick: number;
  nowTick: number;
}

// Wiki (minecraft.wiki/w/Axolotl#Behavior): "When the player kills
// a mob that an axolotl is helping to attack, the player gains
// Regeneration I for 100 seconds and any Mining Fatigue is removed."
//
// Just Regeneration I — Resistance was an earlier misread of the
// wiki and is NOT part of the buff (sibling axolotl_tropical_food.ts
// notes the same correction). The 100-second duration = 2000 ticks
// matches axolotl_revive.ts. The export name `resistanceAmplifier`
// is preserved as a back-compat alias for callers that imported it,
// but the canonical name is now `regenerationAmplifier`.
export const GRACE_DURATION_TICKS = 2000;
export const REGEN_AMPLIFIER = 0;

export function hasGrace(p: PlayerWithAxolotl): boolean {
  return p.axolotlDamagedMobNearby && p.nowTick - p.lastDamageAtTick < GRACE_DURATION_TICKS;
}

export function regenerationAmplifier(p: PlayerWithAxolotl): number {
  return hasGrace(p) ? REGEN_AMPLIFIER : -1;
}

// Back-compat alias — old name was misleading but stays for callers.
export const resistanceAmplifier = regenerationAmplifier;
