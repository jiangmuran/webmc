// Dolphin's grace. Swimming near a dolphin gives +40% swim speed and
// sustained breathing. Dolphins can also lead players to shipwrecks
// when given fish.

export interface DolphinAffinity {
  pettedByPlayer: boolean;
  feedingPlayer: string | null;
  leadingToStructure: 'shipwreck' | 'ruin' | null;
}

// Wiki (minecraft.wiki/w/Dolphin's_Grace): "The player must sprint-
// swim within 9 blocks (Euclidean) of a dolphin to achieve this
// effect with it being replenished if the player continues sprint-
// swimming within 15 blocks (Euclidean)." Old GRACE_RADIUS = 6 was
// 33% short of the 9-block trigger range and didn't model the
// hysteresis between "trigger" and "sustain" radii.
export const GRACE_SPEED_MULT = 1.4;
export const GRACE_TRIGGER_RADIUS = 9;
export const GRACE_SUSTAIN_RADIUS = 15;
// Back-compat alias for callers that referenced the single radius.
export const GRACE_RADIUS = GRACE_TRIGGER_RADIUS;

export function playerHasGrace(distance: number, alreadyHasGrace = false): boolean {
  return alreadyHasGrace ? distance <= GRACE_SUSTAIN_RADIUS : distance <= GRACE_TRIGGER_RADIUS;
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
