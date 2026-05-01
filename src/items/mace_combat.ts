// Wiki (minecraft.wiki/w/Mace#Smash_attack): smash bonus is piecewise
// per block fallen:
//   blocks 1-3:  4 damage per block
//   blocks 4-8:  2 damage per block
//   blocks 9+:   1 damage per block
// (Smash only fires when fallDistance > 1.5.)
//
// Old `min(8, (fall - 1.5) × 3)` was a flat-cap-8 linear ramp — at
// fall=5 the wiki yields 16 (3×4 + 1×2 + 0×2) but the old code
// returned 8. Off by ~2× at mid-range and significantly undercapped
// (wiki has no upper cap on tier-3 contribution, just diminishing
// returns). Sibling mace_smash_damage.ts already uses the piecewise
// wiki formula; this module now matches.

export interface MaceHit {
  fallDistance: number;
  densityBonus: number;
  windBurstLevel: number;
  breachLevel: number;
  baseDamage: number;
}

function piecewiseFallBonus(fallDistance: number): number {
  if (fallDistance <= 1.5) return 0;
  const f = fallDistance;
  const tier1 = 4 * Math.min(3, f);
  const tier2 = 2 * Math.max(0, Math.min(5, f - 3));
  const tier3 = 1 * Math.max(0, f - 8);
  return tier1 + tier2 + tier3;
}

export function smashDamage(h: MaceHit): number {
  return h.baseDamage + piecewiseFallBonus(h.fallDistance) + h.densityBonus;
}

export function windBurstHeight(level: number): number {
  return Math.max(0, level * 0.7);
}

export function breachArmorIgnoreFraction(level: number): number {
  return Math.max(0, Math.min(1, level * 0.15));
}
