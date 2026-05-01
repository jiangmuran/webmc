export type Phase = 'day' | 'night' | 'thunder';

// Wiki (minecraft.wiki/w/Bed): "A bed cannot be slept in if... a raid
// is in progress." The blocker is the raid itself, not the Bad Omen
// status effect — a player carrying Bad Omen who hasn't yet entered
// a village can still sleep. Old `badOmen` field conflated the
// trigger (player effect) with the actual blocker (active raid).
export interface Ctx {
  phase: Phase;
  hostilesNear: boolean;
  raidInProgress: boolean;
}

export function canSleep(c: Ctx): boolean {
  if (c.phase === 'day') return false;
  if (c.raidInProgress) return false;
  if (c.hostilesNear) return false;
  return true;
}

export function skipsNight(c: Ctx): boolean {
  return canSleep(c) && c.phase !== 'thunder';
}

export function skipsThunder(c: Ctx): boolean {
  return canSleep(c) && c.phase === 'thunder';
}
