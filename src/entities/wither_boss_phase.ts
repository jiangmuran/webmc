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

// Wiki (minecraft.wiki/w/Wither): "becomes immune to projectiles
// below half health." Wither armor blocks PROJECTILE damage only,
// NOT melee. Old `damageMultiplier` returned 0 in armored phase
// regardless of damage type — making the boss invulnerable to
// everything for the second half of the fight, when the wiki
// allows melee to keep hitting. And `meleeImmuneIfArmored` had
// the flag inverted: it returned true for melee instead of for
// projectiles.
export type DamageKind = 'melee' | 'projectile';

export function damageMultiplier(s: WitherState, kind: DamageKind = 'melee'): number {
  if (s.phase === 'armored' && kind === 'projectile') return 0;
  return 1;
}

export function projectileImmuneIfArmored(s: WitherState): boolean {
  return s.phase === 'armored';
}

/** @deprecated wiki says wither armor blocks projectiles, not melee. Use projectileImmuneIfArmored. */
export function meleeImmuneIfArmored(_s: WitherState): boolean {
  return false;
}

export function initialExplosionRadius(s: WitherState): number {
  return s.phase === 'summoning' && s.ticksInPhase === SUMMONING_TICKS ? 7 : 0;
}
