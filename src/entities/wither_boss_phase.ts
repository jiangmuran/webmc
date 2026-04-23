export type WitherPhase = 'summoning' | 'regular' | 'armored' | 'dying';

export interface WitherState {
  phase: WitherPhase;
  health: number;
  maxHealth: number;
  ticksInPhase: number;
}

export const SUMMONING_TICKS = 220;
export const ARMORED_THRESHOLD = 0.5;

export function pickPhase(s: WitherState): WitherPhase {
  if (s.health <= 0) return 'dying';
  if (s.phase === 'summoning' && s.ticksInPhase < SUMMONING_TICKS) return 'summoning';
  return s.health / s.maxHealth <= ARMORED_THRESHOLD ? 'armored' : 'regular';
}

export function damageMultiplier(s: WitherState): number {
  return s.phase === 'armored' ? 0 : 1;
}

export function meleeImmuneIfArmored(s: WitherState): boolean {
  return s.phase === 'armored';
}

export function initialExplosionRadius(s: WitherState): number {
  return s.phase === 'summoning' && s.ticksInPhase === SUMMONING_TICKS ? 7 : 0;
}
