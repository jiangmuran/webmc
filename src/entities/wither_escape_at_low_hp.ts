export interface WitherBossState {
  hpPercent: number;
  hasShield: boolean;
  inLowHpAerial: boolean;
}

export const SHIELD_DROP_THRESHOLD = 0.5;

export function atMeleePhase(s: WitherBossState): boolean {
  return s.hpPercent < SHIELD_DROP_THRESHOLD;
}

// Wiki: shielded wither (below 50% HP) is immune to ranged attacks —
// only melee damage applies. Was `!hasShield || atMeleePhase` which
// returned TRUE in melee phase + shielded (impossible to hit with arrows
// per wiki). Now correctly returns true only when no shield is up.
export function takesRangedDamage(s: WitherBossState): boolean {
  return !s.hasShield;
}

export function explodesOnApproach(): number {
  return 5;
}
