export type Phase = 'day' | 'night' | 'thunder';

export interface Ctx {
  phase: Phase;
  hostilesNear: boolean;
  badOmen: boolean;
}

export function canSleep(c: Ctx): boolean {
  if (c.phase === 'day') return false;
  if (c.badOmen) return false;
  if (c.hostilesNear) return false;
  return true;
}

export function skipsNight(c: Ctx): boolean {
  return canSleep(c) && c.phase !== 'thunder';
}

export function skipsThunder(c: Ctx): boolean {
  return canSleep(c) && c.phase === 'thunder';
}
