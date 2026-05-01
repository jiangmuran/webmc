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

// Wiki (minecraft.wiki/w/Dolphin): usableitems lists Raw Cod, Raw
// Salmon, Tropical Fish, and Pufferfish — "any kind of raw fish".
// Old feed() accepted only cod and salmon, silently rejecting
// tropical_fish and pufferfish, so a player feeding a pufferfish
// (a perfectly valid wiki feed item) got no leading behavior.
const DOLPHIN_FEED_ITEMS = new Set([
  'webmc:raw_cod',
  'webmc:raw_salmon',
  'webmc:cod',
  'webmc:salmon',
  'webmc:tropical_fish',
  'webmc:pufferfish',
]);

export function feed(aff: DolphinAffinity, playerId: string, item: string): boolean {
  if (!DOLPHIN_FEED_ITEMS.has(item)) return false;
  aff.feedingPlayer = playerId;
  aff.leadingToStructure = 'shipwreck';
  return true;
}

// Dolphin drowns out of water after 2 minutes (2400 ticks).
export const DOLPHIN_DROWN_TICKS = 2400;
