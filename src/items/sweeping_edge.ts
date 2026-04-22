// Sweeping Edge: sword-only enchantment. Enhances sweep attack damage
// transferred to nearby mobs when a fully-charged horizontal swing
// connects.

export const SWEEPING_EDGE_MAX = 3;

// Fraction of main hit damage dealt to sweep-adjacent entities.
export function sweepFraction(level: number): number {
  if (level <= 0) return 0;
  return level / (level + 1);
}

export const SWEEP_RANGE_BLOCKS = 1.0;

export interface SweepTarget {
  distance: number;
}

export function damageToSweepTarget(
  mainDamage: number,
  level: number,
  target: SweepTarget,
): number {
  if (target.distance > SWEEP_RANGE_BLOCKS) return 0;
  return mainDamage * sweepFraction(level);
}

// Sweep attacks require: sword + full attack cooldown + not sprinting + not critical.
export interface SweepCondition {
  attackStrengthPct: number;
  sprinting: boolean;
  critical: boolean;
}

export function canSweep(c: SweepCondition): boolean {
  return c.attackStrengthPct >= 0.9 && !c.sprinting && !c.critical;
}
