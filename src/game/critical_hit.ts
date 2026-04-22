// Critical hit calculation. A melee attack crits when: (1) attacker is
// falling (vy < 0), (2) not on the ground, (3) not sprinting, (4) not in
// water, (5) not blind/nauseous. Crits multiply base damage by 1.5x.

export interface CritQuery {
  velocityY: number;
  onGround: boolean;
  sprinting: boolean;
  inWater: boolean;
  hasBlindness: boolean;
}

export function isCriticalHit(q: CritQuery): boolean {
  if (q.onGround) return false;
  if (q.velocityY >= 0) return false; // must be descending
  if (q.sprinting) return false;
  if (q.inWater) return false;
  if (q.hasBlindness) return false;
  return true;
}

export function critMultiplier(q: CritQuery): number {
  return isCriticalHit(q) ? 1.5 : 1;
}

// Sweep attack: full-charge sword swing hits all entities in a cone in
// front. Damage = 1 + sweepingEdgeLevel × (sharpnessDamage × factor).
export interface SweepQuery {
  sweepingEdgeLevel: number;
  baseSwordDamage: number;
  sharpnessBonus: number;
  attackChargedRatio: number; // 0..1 cooldown bar
}

export interface SweepResult {
  sweeps: boolean;
  sweepDamage: number;
}

export function sweepingAttack(q: SweepQuery): SweepResult {
  if (q.attackChargedRatio < 0.9) return { sweeps: false, sweepDamage: 0 };
  const base = 1;
  const factor = q.sweepingEdgeLevel === 0 ? 0 : q.sweepingEdgeLevel / (q.sweepingEdgeLevel + 1);
  return { sweeps: true, sweepDamage: base + factor * (q.baseSwordDamage + q.sharpnessBonus) };
}
