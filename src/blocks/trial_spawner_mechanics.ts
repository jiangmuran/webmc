export interface TrialSpawnerState {
  playersRegistered: number;
  mobsAlive: number;
  wavesSpawned: number;
  maxWaves: number;
  ticksSinceLastSpawn: number;
}

export const SPAWN_INTERVAL_TICKS = 40;
export const ENTITY_PER_PLAYER = 4;

export function targetMobCount(s: TrialSpawnerState): number {
  return Math.max(1, s.playersRegistered * ENTITY_PER_PLAYER);
}

export function shouldSpawn(s: TrialSpawnerState): boolean {
  if (s.wavesSpawned >= s.maxWaves) return false;
  if (s.mobsAlive >= targetMobCount(s)) return false;
  return s.ticksSinceLastSpawn >= SPAWN_INTERVAL_TICKS;
}

export function hasGivenReward(s: TrialSpawnerState): boolean {
  return s.wavesSpawned >= s.maxWaves && s.mobsAlive === 0;
}
