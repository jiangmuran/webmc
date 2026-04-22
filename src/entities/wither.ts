// Wither boss state machine. Summoned via the 3-wither-skull T formation;
// has a 10-second "invulnerability grow-up" state before attacking.
// 300 HP total; at <= half HP gains explosion resistance.

export type WitherStage = 'spawning' | 'charged' | 'low_health' | 'dead';

export interface WitherState {
  stage: WitherStage;
  health: number;
  maxHealth: number;
  spawnTimer: number;
  explosionResist: boolean;
  summoningExplosionFired: boolean;
}

const MAX_HEALTH = 300;
const SPAWN_DURATION_SEC = 10;

export function makeWither(): WitherState {
  return {
    stage: 'spawning',
    health: 10, // starts low, climbs during spawn
    maxHealth: MAX_HEALTH,
    spawnTimer: 0,
    explosionResist: false,
    summoningExplosionFired: false,
  };
}

export interface WitherTickResult {
  summoningExplosion: boolean;
}

export function tickWither(state: WitherState, dtSec: number): WitherTickResult {
  if (state.stage === 'dead') return { summoningExplosion: false };
  if (state.stage === 'spawning') {
    state.spawnTimer += dtSec;
    const progress = Math.min(1, state.spawnTimer / SPAWN_DURATION_SEC);
    state.health = Math.floor(10 + progress * (state.maxHealth - 10));
    if (state.spawnTimer >= SPAWN_DURATION_SEC) {
      state.stage = 'charged';
      const fire = !state.summoningExplosionFired;
      state.summoningExplosionFired = true;
      return { summoningExplosion: fire };
    }
  }
  if (state.stage === 'charged' && state.health <= state.maxHealth / 2) {
    state.stage = 'low_health';
    state.explosionResist = true;
  }
  return { summoningExplosion: false };
}

// Damage the wither; invulnerable while spawning.
export interface DamageQuery {
  amount: number;
  source: 'player' | 'explosion' | 'projectile';
}

export function damageWither(state: WitherState, q: DamageQuery): number {
  if (state.stage === 'spawning') return 0; // invulnerable
  if (state.stage === 'low_health' && q.source === 'explosion') return 0;
  state.health = Math.max(0, state.health - q.amount);
  if (state.health <= 0) {
    state.stage = 'dead';
  } else if (state.stage === 'charged' && state.health <= state.maxHealth / 2) {
    state.stage = 'low_health';
    state.explosionResist = true;
  }
  return q.amount;
}
