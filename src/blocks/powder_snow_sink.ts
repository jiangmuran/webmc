export interface EntityInPowder {
  wearingLeatherBoots: boolean;
  falling: boolean;
  freezeTicks: number;
}

export const FREEZE_DAMAGE_START = 140;
export const FULL_FREEZE_TICKS = 300;
export const FREEZE_DAMAGE_PER_SECOND = 1;

export function sinks(e: EntityInPowder): boolean {
  return !e.wearingLeatherBoots;
}

export function freezeDamageApplied(e: EntityInPowder): number {
  if (e.freezeTicks < FREEZE_DAMAGE_START) return 0;
  return FREEZE_DAMAGE_PER_SECOND;
}

export function canStandOnLeatherBoots(): boolean {
  return true;
}
