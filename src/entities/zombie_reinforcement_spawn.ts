// Zombie reinforcement. On hard, a zombie taking damage has a small
// chance to spawn another zombie nearby. Capped at ~10 reinforcements
// per chain to prevent cascades.

export interface ReinforcementState {
  totalSpawned: number;
  currentSpawnChance: number; // 0..1
}

export const MAX_CHAIN = 10;

export function makeReinforcement(initialChance = 0.05): ReinforcementState {
  return { totalSpawned: 0, currentSpawnChance: initialChance };
}

export interface DamageEvent {
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  rand: () => number;
}

export function tryReinforce(s: ReinforcementState, e: DamageEvent): boolean {
  if (e.difficulty !== 'hard') return false;
  if (s.totalSpawned >= MAX_CHAIN) return false;
  if (e.rand() >= s.currentSpawnChance) return false;
  s.totalSpawned += 1;
  s.currentSpawnChance = Math.max(0, s.currentSpawnChance - 0.05);
  return true;
}

// Higher-level "local difficulty" nudges the initial chance up with
// time spent in a chunk.
export function initialChanceForLocalDifficulty(local: number): number {
  return Math.min(0.5, 0.05 * (1 + local));
}
