export interface AllayState {
  ticksSinceDupe: number;
  hasAmethystHeld: boolean;
  nearDancingJukebox: boolean;
}

export const DUPE_COOLDOWN_TICKS = 20 * 60 * 5;

export function canDuplicate(s: AllayState): boolean {
  if (!s.hasAmethystHeld) return false;
  if (!s.nearDancingJukebox) return false;
  return s.ticksSinceDupe >= DUPE_COOLDOWN_TICKS;
}

export function dropsHeldOnDuplicate(s: AllayState): boolean {
  return canDuplicate(s);
}

export function pickupMatches(heldItem: string, candidate: string): boolean {
  return heldItem === candidate;
}
