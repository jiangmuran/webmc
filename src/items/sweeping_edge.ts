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

// Sweep attacks require: sword + 84.8%+ attack cooldown + not sprinting + not critical.
export interface SweepCondition {
  attackStrengthPct: number;
  sprinting: boolean;
  critical: boolean;
}

// Wiki (minecraft.wiki/w/Melee_attack#Attack_cooldown): "An attack
// cooldown percentage of 84.8% or above is also required for
// critical hits, sprint-knockback attacks, and sweep attacks to
// activate." Old threshold of 90% was too strict — players hitting
// at the wiki's 85–89% would lose the sweep, leaving slightly-early
// swings that should sweep firing as plain hits.
export const SWEEP_COOLDOWN_THRESHOLD = 0.848;

export function canSweep(c: SweepCondition): boolean {
  return c.attackStrengthPct >= SWEEP_COOLDOWN_THRESHOLD && !c.sprinting && !c.critical;
}
