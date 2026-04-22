// Trial spawner. Spawns waves of mobs scaled to nearby players.
// Ejects reward once defeated; ominous variant drops ominous loot.

export interface TrialSpawnerState {
  nearbyPlayers: number;
  wavesRemaining: number;
  activeMobs: number;
  ominous: boolean;
  rewardDropped: boolean;
}

export const TRIAL_SPAWNER_BASE_WAVES = 3;
export const MAX_ACTIVE_MOBS_PER_PLAYER = 2;

export function activeMobCap(s: TrialSpawnerState): number {
  return Math.max(1, s.nearbyPlayers * MAX_ACTIVE_MOBS_PER_PLAYER);
}

export function shouldSpawn(s: TrialSpawnerState): boolean {
  if (s.wavesRemaining <= 0) return false;
  return s.activeMobs < activeMobCap(s);
}

export function onWaveDefeated(s: TrialSpawnerState): TrialSpawnerState {
  return {
    ...s,
    wavesRemaining: Math.max(0, s.wavesRemaining - 1),
    activeMobs: 0,
  };
}

export function ejectReward(s: TrialSpawnerState): TrialSpawnerState {
  if (s.wavesRemaining > 0 || s.rewardDropped) return s;
  return { ...s, rewardDropped: true };
}

export function makeTrialSpawner(nearbyPlayers: number, ominous = false): TrialSpawnerState {
  return {
    nearbyPlayers,
    wavesRemaining: TRIAL_SPAWNER_BASE_WAVES,
    activeMobs: 0,
    ominous,
    rewardDropped: false,
  };
}
