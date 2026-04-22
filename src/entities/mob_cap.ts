// Mob cap. Enforces per-category maximums in a ~17×17 chunk "mob
// simulation area". Scales with loaded chunks / per-player.

export type MobCategory = 'hostile' | 'passive' | 'ambient' | 'water_creature' | 'axolotl';

export const CAP_PER_PLAYER_CHUNKS: Record<MobCategory, number> = {
  hostile: 70,
  passive: 10,
  ambient: 15,
  water_creature: 5,
  axolotl: 5,
};

export interface MobCapState {
  counts: Record<MobCategory, number>;
}

export function makeMobCap(): MobCapState {
  return {
    counts: { hostile: 0, passive: 0, ambient: 0, water_creature: 0, axolotl: 0 },
  };
}

export function canSpawn(state: MobCapState, category: MobCategory): boolean {
  return state.counts[category] < CAP_PER_PLAYER_CHUNKS[category];
}

export function noteSpawn(state: MobCapState, category: MobCategory): void {
  state.counts[category]++;
}

export function noteDespawn(state: MobCapState, category: MobCategory): void {
  state.counts[category] = Math.max(0, state.counts[category] - 1);
}

export function fillPercent(state: MobCapState, category: MobCategory): number {
  return state.counts[category] / CAP_PER_PLAYER_CHUNKS[category];
}
