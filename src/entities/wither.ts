// Wither boss state machine. Summoned via the 3-wither-skull T formation;
// has an 11-second "invulnerability grow-up" state before attacking.
// 300 HP total; at <= half HP gains immunity to projectiles.
//
// Wiki (minecraft.wiki/w/Wither):
//   Spawn invulnerability: "When this state ends after 11 seconds or
//     220 game ticks" — old SPAWN_DURATION_SEC = 10 was 1 s short.
//   Half-HP shield: "becomes immune to projectiles below half health"
//     — old code immunized against EXPLOSIONS, not projectiles.
//
// Explosions still hurt the wither at low HP; arrows, snowballs, and
// trident throws bounce off.

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
const SPAWN_DURATION_SEC = 11;

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
  if (state.stage === 'low_health' && q.source === 'projectile') return 0;
  state.health = Math.max(0, state.health - q.amount);
  if (state.health <= 0) {
    state.stage = 'dead';
  } else if (state.stage === 'charged' && state.health <= state.maxHealth / 2) {
    state.stage = 'low_health';
    state.explosionResist = true;
  }
  return q.amount;
}
