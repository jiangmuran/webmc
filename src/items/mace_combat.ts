export interface MaceHit {
  fallDistance: number;
  densityBonus: number;
  windBurstLevel: number;
  breachLevel: number;
  baseDamage: number;
}

export function smashDamage(h: MaceHit): number {
  const fallBonus = h.fallDistance <= 1.5 ? 0 : Math.min(8, (h.fallDistance - 1.5) * 3);
  return h.baseDamage + fallBonus + h.densityBonus;
}

export function windBurstHeight(level: number): number {
  return Math.max(0, level * 0.7);
}

export function breachArmorIgnoreFraction(level: number): number {
  return Math.max(0, Math.min(1, level * 0.15));
}
