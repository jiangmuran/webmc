// Creaking: tethered mob from the pale garden. Only moves when no
// player is looking; invulnerable unless its heart block is broken.

export interface CreakingState {
  tethered: boolean;
  heartBroken: boolean;
  observedByPlayer: boolean;
  inDaylight: boolean;
}

export function canMove(s: CreakingState): boolean {
  if (s.observedByPlayer) return false;
  if (s.inDaylight) return false;
  return true;
}

export function takesDamage(s: CreakingState, damageType: string): boolean {
  if (damageType === 'generic' && !s.heartBroken) return false;
  return true;
}

export function onHeartBreak(s: CreakingState): CreakingState {
  return { ...s, heartBroken: true, tethered: false };
}

export const CREAKING_TETHER_RANGE = 32;

export function withinTether(distance: number): boolean {
  return distance <= CREAKING_TETHER_RANGE;
}
