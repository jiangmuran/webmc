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

// Wiki (minecraft.wiki/w/Trial_Spawner) default Spawning values:
// "Simultaneous mobs (base) = 2, Simultaneous mobs added per
// player = 1." Wiki: "With 2 players, 8 mobs spawn in total with 3
// at once, and with 3 players, 10 mobs spawn in total with 4 at
// once." So the simultaneous-mob cap is `2 + (N − 1) × 1` for
// N ≥ 1 players.
//
// Old `nearbyPlayers × 2` matched canon at 1 player (2 mobs) but
// over-spawned at higher counts: 4 mobs vs 3 at 2 players, 6 vs 4
// at 3 players — making multi-player trial chambers significantly
// more chaotic than canon.
export const SIMULTANEOUS_MOBS_BASE = 2;
export const SIMULTANEOUS_MOBS_PER_EXTRA_PLAYER = 1;
export const MAX_ACTIVE_MOBS_PER_PLAYER = 2; // legacy export, kept for callers

export function activeMobCap(s: TrialSpawnerState): number {
  if (s.nearbyPlayers <= 0) return 1;
  return SIMULTANEOUS_MOBS_BASE + (s.nearbyPlayers - 1) * SIMULTANEOUS_MOBS_PER_EXTRA_PLAYER;
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
