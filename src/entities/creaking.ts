// Creaking (Pale Garden, 1.21.4). Hostile mob spawned by the Creaking Heart
// block; can only move when no player has line-of-sight; damaging the mob
// is reflected as damage to the heart block (~80 blocks away). The Creaking
// de-spawns if its heart is destroyed.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type CreakingStance = 'moving' | 'frozen' | 'despawning';

export interface CreakingState {
  id: number;
  position: Vec3;
  heartPos: Vec3;
  heartAlive: boolean;
  stance: CreakingStance;
}

export function makeCreaking(id: number, at: Vec3, heart: Vec3): CreakingState {
  return {
    id,
    position: { ...at },
    heartPos: { ...heart },
    heartAlive: true,
    stance: 'frozen',
  };
}

export interface CreakingTickCtx {
  anyPlayerWatching: boolean;
  dtSec: number;
}

// Movement is gated on no player looking at it.
export function updateStance(state: CreakingState, ctx: CreakingTickCtx): void {
  if (!state.heartAlive) {
    state.stance = 'despawning';
    return;
  }
  state.stance = ctx.anyPlayerWatching ? 'frozen' : 'moving';
}

// Damage query: damage is not applied to the creaking itself; instead, an
// equivalent amount is dealt to the heart block. Returns the heart-damage
// to propagate.
export interface DamageForward {
  damageToHeart: number;
}

export function forwardDamageToHeart(state: CreakingState, amount: number): DamageForward {
  if (!state.heartAlive) return { damageToHeart: 0 };
  return { damageToHeart: amount };
}

// When the heart is reported dead, the creaking dies immediately.
export function onHeartDestroyed(state: CreakingState): void {
  state.heartAlive = false;
  state.stance = 'despawning';
}
