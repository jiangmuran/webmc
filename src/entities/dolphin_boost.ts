// Dolphin's grace. Swimming near a dolphin gives +40% swim speed and
// sustained breathing. Dolphins can also lead players to shipwrecks
// when given fish.

export interface DolphinAffinity {
  pettedByPlayer: boolean;
  feedingPlayer: string | null;
  leadingToStructure: 'shipwreck' | 'ruin' | null;
}

export const GRACE_SPEED_MULT = 1.4;
export const GRACE_RADIUS = 6;

export function playerHasGrace(distance: number): boolean {
  return distance <= GRACE_RADIUS;
}

export function swimSpeedMult(grace: boolean): number {
  return grace ? GRACE_SPEED_MULT : 1;
}

export function feed(aff: DolphinAffinity, playerId: string, item: string): boolean {
  if (
    item !== 'webmc:raw_cod' &&
    item !== 'webmc:raw_salmon' &&
    item !== 'webmc:cod' &&
    item !== 'webmc:salmon'
  ) {
    return false;
  }
  aff.feedingPlayer = playerId;
  aff.leadingToStructure = 'shipwreck';
  return true;
}

// Dolphin drowns out of water after 2 minutes (2400 ticks).
export const DOLPHIN_DROWN_TICKS = 2400;
