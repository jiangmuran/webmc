// Trial chamber mob spawner. Spawns a scaled wave when a player
// enters range; stops when player leaves or max mobs reached. Unlike
// regular spawners, drops keys (trial/vault) on clear.

export type ChamberPhase = 'inactive' | 'active' | 'cooldown' | 'ejecting_rewards';

export interface TrialSpawner {
  phase: ChamberPhase;
  mobsAlive: number;
  totalSpawned: number;
  targetWaveCount: number;
  playerCountWithinRange: number;
}

export const DETECT_RANGE = 14;
export const COOLDOWN_TICKS = 600; // 30s
export const MAX_MOBS = 10;

export function makeSpawner(): TrialSpawner {
  return {
    phase: 'inactive',
    mobsAlive: 0,
    totalSpawned: 0,
    targetWaveCount: 4,
    playerCountWithinRange: 0,
  };
}

export interface ActivationQuery {
  playersInRange: number;
}

export function activate(s: TrialSpawner, q: ActivationQuery, rand: () => number): boolean {
  if (s.phase !== 'inactive') return false;
  if (q.playersInRange <= 0) return false;
  s.phase = 'active';
  s.playerCountWithinRange = q.playersInRange;
  s.targetWaveCount = 4 + q.playersInRange * 2 + Math.floor(rand() * 2);
  s.totalSpawned = 0;
  s.mobsAlive = 0;
  return true;
}

export interface SpawnTickResult {
  spawn: boolean;
  keysOnClear: number;
}

export function tickSpawn(s: TrialSpawner): SpawnTickResult {
  if (s.phase !== 'active') return { spawn: false, keysOnClear: 0 };
  if (s.mobsAlive >= MAX_MOBS) return { spawn: false, keysOnClear: 0 };
  if (s.totalSpawned >= s.targetWaveCount) {
    // Wave complete when last mob dies (handled in onMobDeath).
    return { spawn: false, keysOnClear: 0 };
  }
  s.totalSpawned += 1;
  s.mobsAlive += 1;
  return { spawn: true, keysOnClear: 0 };
}

export function onMobDeath(s: TrialSpawner): SpawnTickResult {
  s.mobsAlive = Math.max(0, s.mobsAlive - 1);
  if (s.phase === 'active' && s.totalSpawned >= s.targetWaveCount && s.mobsAlive === 0) {
    s.phase = 'ejecting_rewards';
    return { spawn: false, keysOnClear: 1 + s.playerCountWithinRange };
  }
  return { spawn: false, keysOnClear: 0 };
}
