export interface MaceSmashInput {
  fallDistance: number;
  densityLevel: number;
  breachLevel: number;
  windBurstLevel: number;
}

export const BASE_MACE_DAMAGE = 6;

export function smashBonusDamage(i: MaceSmashInput): number {
  if (i.fallDistance < 1.5) return 0;
  const fallBonus = Math.min(40, i.fallDistance * 0.5);
  const density = i.densityLevel * 0.5;
  return fallBonus + density * i.fallDistance * 0.1;
}

export function totalMaceDamage(i: MaceSmashInput, baseMelee: number): number {
  return baseMelee + smashBonusDamage(i);
}

export function breachReducesArmor(breachLevel: number, armor: number): number {
  return Math.max(0, armor - breachLevel * 0.15 * armor);
}

export function windBurstVelocity(windBurstLevel: number): number {
  return windBurstLevel * 0.5;
}
