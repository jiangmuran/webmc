// Vault block (1.21). Requires a trial key to unlock; each player can
// claim its reward exactly once (tracked via UUID set). After unlocking
// it cycles: inactive → unlocking → ejecting → inactive (cooldown until
// next wave). Ominous variant gives better loot.

export type VaultStatus = 'inactive' | 'active' | 'unlocking' | 'ejecting';

export interface VaultState {
  status: VaultStatus;
  ominous: boolean;
  unlockedBy: Set<string>;
  cooldownSec: number;
}

export function makeVault(ominous = false): VaultState {
  return {
    status: 'active',
    ominous,
    unlockedBy: new Set(),
    cooldownSec: 0,
  };
}

export interface VaultUnlockQuery {
  playerId: string;
  hasKey: boolean;
}

export interface VaultUnlockResult {
  accepted: boolean;
  reason?: 'no_key' | 'already_claimed' | 'not_active';
  keyConsumed: boolean;
}

export function tryUnlockVault(state: VaultState, q: VaultUnlockQuery): VaultUnlockResult {
  if (state.status !== 'active') {
    return { accepted: false, reason: 'not_active', keyConsumed: false };
  }
  if (state.unlockedBy.has(q.playerId)) {
    return { accepted: false, reason: 'already_claimed', keyConsumed: false };
  }
  if (!q.hasKey) {
    return { accepted: false, reason: 'no_key', keyConsumed: false };
  }
  state.unlockedBy.add(q.playerId);
  state.status = 'unlocking';
  return { accepted: true, keyConsumed: true };
}

const UNLOCK_DURATION_SEC = 2;
const EJECT_DURATION_SEC = 1;
const COOLDOWN_SEC = 60;

export function tickVault(state: VaultState, dtSec: number): 'idle' | 'ejected' {
  state.cooldownSec = Math.max(0, state.cooldownSec - dtSec);
  if (state.status === 'unlocking') {
    state.cooldownSec += dtSec; // reuse timer
    if (state.cooldownSec >= UNLOCK_DURATION_SEC) {
      state.cooldownSec = 0;
      state.status = 'ejecting';
    }
    return 'idle';
  }
  if (state.status === 'ejecting') {
    state.cooldownSec += dtSec;
    if (state.cooldownSec >= EJECT_DURATION_SEC) {
      state.cooldownSec = COOLDOWN_SEC;
      state.status = 'inactive';
      return 'ejected';
    }
    return 'idle';
  }
  if (state.status === 'inactive' && state.cooldownSec === 0) {
    state.status = 'active';
  }
  return 'idle';
}

export interface VaultLootEntry {
  item: string;
  weight: number;
  ominousOnly: boolean;
}

export const VAULT_LOOT: readonly VaultLootEntry[] = [
  { item: 'webmc:emerald', weight: 30, ominousOnly: false },
  { item: 'webmc:diamond', weight: 10, ominousOnly: false },
  { item: 'webmc:iron_ingot', weight: 20, ominousOnly: false },
  { item: 'webmc:golden_apple', weight: 10, ominousOnly: false },
  { item: 'webmc:crossbow', weight: 5, ominousOnly: false },
  { item: 'webmc:heavy_core', weight: 2, ominousOnly: true },
  { item: 'webmc:flow_armor_trim', weight: 3, ominousOnly: true },
  { item: 'webmc:bolt_armor_trim', weight: 3, ominousOnly: true },
];

export function rollVaultLoot(ominous: boolean, roll: number): VaultLootEntry | null {
  const pool = VAULT_LOOT.filter((e) => ominous || !e.ominousOnly);
  const total = pool.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of pool) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return pool[pool.length - 1] ?? null;
}
