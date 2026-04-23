export interface WitherBossState {
  hpPercent: number;
  hasShield: boolean;
  inLowHpAerial: boolean;
}

export const SHIELD_DROP_THRESHOLD = 0.5;

export function atMeleePhase(s: WitherBossState): boolean {
  return s.hpPercent < SHIELD_DROP_THRESHOLD;
}

export function takesRangedDamage(s: WitherBossState): boolean {
  return !s.hasShield || atMeleePhase(s);
}

export function explodesOnApproach(): number {
  return 5;
}
