export interface MaceSmashInput {
  fallDistance: number;
  densityLevel: number;
  breachLevel: number;
  windBurstLevel: number;
}

export const BASE_MACE_DAMAGE = 6;

// Wiki (minecraft.wiki/w/Mace#Smash_attack): bonus damage from a
// smash is piecewise:
//   blocks 1-3:  4 damage each
//   blocks 4-8:  2 damage each
//   blocks 9+:   1 damage each
// Density (max V) adds 0.5 damage per level per fallen block on top.
// Old formula was a flat 0.5 × fall capped at 40 plus a tiny density
// term, which under-shot every fall (10-block smash gave 5, wiki ~24).
export function smashBonusDamage(i: MaceSmashInput): number {
  if (i.fallDistance < 1.5) return 0;
  const f = i.fallDistance;
  const tier1 = 4 * Math.min(3, f);
  const tier2 = 2 * Math.max(0, Math.min(5, f - 3));
  const tier3 = 1 * Math.max(0, f - 8);
  const baseFall = tier1 + tier2 + tier3;
  const density = Math.max(0, Math.min(5, i.densityLevel)) * 0.5 * f;
  return baseFall + density;
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
