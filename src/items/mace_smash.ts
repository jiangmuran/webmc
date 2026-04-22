// Mace weapon (1.21). Damage scales with fall distance before the
// smash hit; heavy core + breach + density enchants apply.

export interface MaceHit {
  fallDistance: number;
  densityLevel: number;
  breachLevel: number;
}

export const MACE_BASE_DAMAGE = 6;

export function smashDamage(h: MaceHit): number {
  // Per wiki: first 3 blocks +4/block, next 5 +2/block, beyond +1/block.
  let bonus = 0;
  const f = Math.max(0, h.fallDistance);
  const first = Math.min(3, f);
  const second = Math.min(5, Math.max(0, f - 3));
  const rest = Math.max(0, f - 8);
  bonus += first * 4;
  bonus += second * 2;
  bonus += rest * 1;
  const density = h.densityLevel * 0.5 * f;
  return MACE_BASE_DAMAGE + bonus + density;
}

// Breach reduces armor effectiveness by 15% per level.
export function armorEffectiveness(breachLevel: number): number {
  return Math.max(0, 1 - 0.15 * breachLevel);
}

export function resetsFallDamage(wasSmashHit: boolean): boolean {
  return wasSmashHit;
}
