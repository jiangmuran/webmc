export interface AllayState {
  lastDupTick: number;
  heldItem?: string;
  recentlyFedAmethyst: boolean;
  danceTicksRemaining: number;
}

export const DUP_COOLDOWN_TICKS = 6000;

export function canDuplicate(a: AllayState, nowTick: number): boolean {
  if (!a.recentlyFedAmethyst) return false;
  if (a.danceTicksRemaining <= 0) return false;
  return nowTick - a.lastDupTick >= DUP_COOLDOWN_TICKS;
}

export function afterDup(a: AllayState, nowTick: number): AllayState {
  return { ...a, lastDupTick: nowTick, recentlyFedAmethyst: false };
}
