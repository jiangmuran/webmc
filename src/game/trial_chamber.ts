// Trial chambers (1.21). A trial spawner cycles between dormant / active /
// cooldown, releasing waves of mobs scaled to nearby player count. Trial
// keys drop on completion, used to open Vault blocks which give per-player
// rewards (player can only claim one reward per vault).

export type SpawnerStatus = 'dormant' | 'active' | 'cooldown' | 'ejecting';

export interface TrialSpawnerState {
  status: SpawnerStatus;
  mobsSpawned: number;
  maxMobs: number; // scales with player count
  activeMobsAlive: number;
  cooldownSec: number; // 30min after clear
  ominous: boolean; // "ominous trial" buffed variant
}

const BASE_MOBS_PER_PLAYER = 6;
const OMINOUS_BONUS = 2;
const COOLDOWN_SEC = 1800;

export function makeSpawner(ominous = false): TrialSpawnerState {
  return {
    status: 'dormant',
    mobsSpawned: 0,
    maxMobs: 0,
    activeMobsAlive: 0,
    cooldownSec: 0,
    ominous,
  };
}

// Player enters activation range (14 blocks) and the spawner wakes up.
export function activateSpawner(state: TrialSpawnerState, playerCount: number): void {
  if (state.status !== 'dormant') return;
  state.status = 'active';
  state.mobsSpawned = 0;
  state.activeMobsAlive = 0;
  const base = BASE_MOBS_PER_PLAYER * Math.max(1, playerCount);
  state.maxMobs = state.ominous ? base + OMINOUS_BONUS * playerCount : base;
}

export interface SpawnerTickContext {
  canSpawn: () => boolean;
  dtSec: number;
}

export interface SpawnerTickResult {
  shouldSpawn: boolean;
  shouldEject: boolean;
  ended: boolean;
}

export function tickSpawner(state: TrialSpawnerState, ctx: SpawnerTickContext): SpawnerTickResult {
  switch (state.status) {
    case 'dormant':
      return { shouldSpawn: false, shouldEject: false, ended: false };
    case 'active': {
      if (state.mobsSpawned >= state.maxMobs && state.activeMobsAlive === 0) {
        state.status = 'ejecting';
        return { shouldSpawn: false, shouldEject: true, ended: true };
      }
      const couldSpawn =
        state.mobsSpawned < state.maxMobs && state.activeMobsAlive < 2 && ctx.canSpawn();
      if (couldSpawn) {
        state.mobsSpawned++;
        state.activeMobsAlive++;
      }
      return { shouldSpawn: couldSpawn, shouldEject: false, ended: false };
    }
    case 'ejecting':
      state.status = 'cooldown';
      state.cooldownSec = COOLDOWN_SEC;
      return { shouldSpawn: false, shouldEject: false, ended: false };
    case 'cooldown':
      state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
      if (state.cooldownSec === 0) state.status = 'dormant';
      return { shouldSpawn: false, shouldEject: false, ended: false };
  }
}

// ─── Vaults ──────────────────────────────────────────────────────────
// Vaults accept one key each and give one reward per player. Ominous
// vaults use ominous trial keys and give rarer rewards.

export interface VaultState {
  claimedByPlayers: Set<string>;
  ominous: boolean;
}

export function makeVault(ominous = false): VaultState {
  return { claimedByPlayers: new Set(), ominous };
}

export interface VaultQuery {
  keyName: string; // 'webmc:trial_key' or 'webmc:ominous_trial_key'
  playerId: string;
}

export interface VaultResult {
  accepted: boolean;
  reason?: string;
}

export function tryOpenVault(vault: VaultState, q: VaultQuery): VaultResult {
  if (vault.claimedByPlayers.has(q.playerId)) {
    return { accepted: false, reason: 'already_claimed' };
  }
  const expectedKey = vault.ominous ? 'webmc:ominous_trial_key' : 'webmc:trial_key';
  if (q.keyName !== expectedKey) {
    return { accepted: false, reason: 'wrong_key' };
  }
  vault.claimedByPlayers.add(q.playerId);
  return { accepted: true };
}
