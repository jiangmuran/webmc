export interface Slots {
  mainhand?: string;
  offhand?: string;
}

export const TOTEM = 'totem_of_undying';

export function totemSlot(s: Slots): 'mainhand' | 'offhand' | undefined {
  if (s.offhand === TOTEM) return 'offhand';
  if (s.mainhand === TOTEM) return 'mainhand';
  return undefined;
}

export function triggersOnLethalDamage(s: Slots): boolean {
  return totemSlot(s) !== undefined;
}

export function consumedAfterUse(): boolean {
  return true;
}
