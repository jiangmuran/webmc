// Ender Dragon AI fight phases.

export type DragonPhase =
  | 'holding_pattern'
  | 'strafing'
  | 'landing_approach'
  | 'landed_roar'
  | 'landed_breath'
  | 'fleeing'
  | 'dying';

export interface DragonState {
  health: number;
  maxHealth: number;
  currentPhase: DragonPhase;
  phaseTicks: number;
}

const HEALTHY_PHASES: DragonPhase[] = [
  'holding_pattern',
  'strafing',
  'landing_approach',
  'landed_roar',
  'landed_breath',
];

export function chooseNextPhase(s: DragonState, rand: () => number): DragonPhase {
  if (s.health <= 0) return 'dying';
  if (s.health < s.maxHealth * 0.3) return rand() < 0.5 ? 'strafing' : 'fleeing';
  const idx = Math.floor(rand() * HEALTHY_PHASES.length);
  return HEALTHY_PHASES[idx] ?? 'holding_pattern';
}

export const LANDING_MIN_TICKS = 200;
export const ROAR_TICKS = 100;

export function shouldEnterLanding(s: DragonState): boolean {
  return s.currentPhase === 'holding_pattern' && s.phaseTicks > LANDING_MIN_TICKS;
}

export function dyingDuration(): number {
  return 200;
}
