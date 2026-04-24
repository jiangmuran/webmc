export interface XpOrb {
  id: string;
  value: number;
  x: number;
  y: number;
  z: number;
  ageTicks: number;
}

export const MERGE_RADIUS = 0.5;
export const LIFETIME_TICKS = 20 * 60 * 5;

export function canMerge(a: XpOrb, b: XpOrb): boolean {
  if (a.id === b.id) return false;
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) <= MERGE_RADIUS;
}

export function merge(a: XpOrb, b: XpOrb): XpOrb {
  return {
    ...a,
    value: a.value + b.value,
    ageTicks: Math.min(a.ageTicks, b.ageTicks),
  };
}

export function expired(orb: XpOrb): boolean {
  return orb.ageTicks >= LIFETIME_TICKS;
}
