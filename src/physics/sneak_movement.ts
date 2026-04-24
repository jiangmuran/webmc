export const SNEAK_SPEED_MULT = 0.3;
export const SNEAK_HITBOX_HEIGHT = 1.5;

export interface SneakInput {
  sneaking: boolean;
  onEdge: boolean;
  wearingCarvedPumpkin: boolean;
}

export function moveSpeedMultiplier(i: SneakInput): number {
  return i.sneaking ? SNEAK_SPEED_MULT : 1;
}

export function wouldFallOff(i: SneakInput): boolean {
  if (!i.sneaking) return i.onEdge;
  return false;
}

export function canSeeEnderman(i: SneakInput): boolean {
  return i.wearingCarvedPumpkin;
}
