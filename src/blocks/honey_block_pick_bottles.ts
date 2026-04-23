export interface Beehive {
  honeyLevel: number;
  maxLevel: number;
}

export const FULL_LEVEL = 5;

export function canHarvest(h: Beehive, itemUsed: 'bottle' | 'shears' | 'other'): boolean {
  if (h.honeyLevel < FULL_LEVEL) return false;
  return itemUsed === 'bottle' || itemUsed === 'shears';
}

export function afterHarvest(h: Beehive): Beehive {
  if (h.honeyLevel < FULL_LEVEL) return h;
  return { ...h, honeyLevel: 0 };
}

export function produces(itemUsed: 'bottle' | 'shears' | 'other'): string | undefined {
  if (itemUsed === 'bottle') return 'honey_bottle';
  if (itemUsed === 'shears') return 'honeycomb';
  return undefined;
}
