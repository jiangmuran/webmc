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

// Wiki (minecraft.wiki/w/End_Crystal#Healing_the_ender_dragon): "The
// dragon is healed 1 HP each half-second" from the nearest active
// crystal within a 32-block cuboid — single-source, not multiplied
// by the count of crystals alive.
//
// 1 HP per 0.5s = 1 HP per 10 ticks = 0.1 HP per tick. Old constant
// 0.5 HP/tick (commented as "10 HP/sec") was 5× over the wiki rate.
// Sibling end_crystal_beam.ts and ender_crystal_beam_link.ts now
// agree at 0.1 HP/tick.
export function healthRegenPerTick(s: DragonState): number {
  if (s.crystalsAlive <= 0) return 0;
  if (s.health >= s.maxHealth) return 0;
  return 0.1;
}
