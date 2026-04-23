export type DragonPhase =
  | 'holding_pattern'
  | 'strafe_player'
  | 'landing_approach'
  | 'landed'
  | 'breath_attack'
  | 'charge_player'
  | 'dying';

export interface DragonState {
  phase: DragonPhase;
  health: number;
  maxHealth: number;
  ticksInPhase: number;
  crystalsAlive: number;
  engagedPlayer?: string;
}

export const MAX_HEALTH = 200;

export function pickNextPhase(s: DragonState): DragonPhase {
  if (s.health <= 0) return 'dying';
  if (s.phase === 'holding_pattern' && s.ticksInPhase > 100 && s.engagedPlayer !== undefined) {
    return s.ticksInPhase % 2 === 0 ? 'strafe_player' : 'landing_approach';
  }
  if (s.phase === 'landed' && s.ticksInPhase > 200) return 'breath_attack';
  if (s.phase === 'breath_attack' && s.ticksInPhase > 400) return 'landing_approach';
  if (s.phase === 'landing_approach' && s.ticksInPhase > 80) return 'landed';
  if (s.phase === 'strafe_player' && s.ticksInPhase > 120) return 'holding_pattern';
  return s.phase;
}

export function healthRegenPerTick(s: DragonState): number {
  return s.crystalsAlive > 0 && s.health < s.maxHealth ? s.crystalsAlive * 0.01 : 0;
}
