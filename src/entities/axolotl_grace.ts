export interface PlayerWithAxolotl {
  axolotlDamagedMobNearby: boolean;
  lastDamageAtTick: number;
  nowTick: number;
}

export const GRACE_DURATION_TICKS = 2400;
export const REGEN_AMPLIFIER = 0;

export function hasGrace(p: PlayerWithAxolotl): boolean {
  return p.axolotlDamagedMobNearby && p.nowTick - p.lastDamageAtTick < GRACE_DURATION_TICKS;
}

export function resistanceAmplifier(p: PlayerWithAxolotl): number {
  return hasGrace(p) ? REGEN_AMPLIFIER : -1;
}
