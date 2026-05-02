export interface TrialSpawnerState {
  playersRegistered: number;
  mobsAlive: number;
  wavesSpawned: number;
  maxWaves: number;
  ticksSinceLastSpawn: number;
}

// Wiki (minecraft.wiki/w/Trial_Spawner): "With 1 player, it does not
// spawn a mob if there are already 2 mobs from the spawner that are
// still alive. ... For each additional player present, the
// simultaneous mob count increases by 1." So the cap is
// `1 + max(1, nPlayers)`: 2 / 3 / 4 simultaneous at 1/2/3 players.
// Old `nPlayers * 4` gave 4 / 8 / 12, ~2-3× the wiki value.
export const SPAWN_INTERVAL_TICKS = 40;

export function targetMobCount(s: TrialSpawnerState): number {
  const players = Math.max(1, s.playersRegistered);
  return players + 1;
}

export function shouldSpawn(s: TrialSpawnerState): boolean {
  if (s.wavesSpawned >= s.maxWaves) return false;
  if (s.mobsAlive >= targetMobCount(s)) return false;
  return s.ticksSinceLastSpawn >= SPAWN_INTERVAL_TICKS;
}

export function hasGivenReward(s: TrialSpawnerState): boolean {
  return s.wavesSpawned >= s.maxWaves && s.mobsAlive === 0;
}
