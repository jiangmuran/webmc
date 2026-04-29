export interface PlayerWithAxolotl {
  axolotlDamagedMobNearby: boolean;
  lastDamageAtTick: number;
  nowTick: number;
}

// Wiki (minecraft.wiki/w/Axolotl#Behavior): the post-combat Regen I +
// Resistance I buff lasts 100 seconds (2000 ticks). Old constant was
// 2400 (120s), inconsistent with axolotl_revive's wiki-aligned 100s.
export const GRACE_DURATION_TICKS = 2000;
export const REGEN_AMPLIFIER = 0;

export function hasGrace(p: PlayerWithAxolotl): boolean {
  return p.axolotlDamagedMobNearby && p.nowTick - p.lastDamageAtTick < GRACE_DURATION_TICKS;
}

export function resistanceAmplifier(p: PlayerWithAxolotl): number {
  return hasGrace(p) ? REGEN_AMPLIFIER : -1;
}
