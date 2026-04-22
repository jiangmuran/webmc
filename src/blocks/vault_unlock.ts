// Vault block. Inserting a trial key unlocks and ejects loot once
// per player (tracked by UUID). Ominous vault uses ominous key.

export interface VaultState {
  unlockedBy: Set<string>;
  ominous: boolean;
}

export type KeyKind = 'trial_key' | 'ominous_trial_key';

export function requiredKey(v: VaultState): KeyKind {
  return v.ominous ? 'ominous_trial_key' : 'trial_key';
}

export interface InsertResult {
  accepted: boolean;
  reason?: 'already_rewarded' | 'wrong_key';
}

export function insertKey(v: VaultState, playerId: string, key: KeyKind): InsertResult {
  if (key !== requiredKey(v)) return { accepted: false, reason: 'wrong_key' };
  if (v.unlockedBy.has(playerId)) return { accepted: false, reason: 'already_rewarded' };
  v.unlockedBy.add(playerId);
  return { accepted: true };
}

export function makeVault(ominous = false): VaultState {
  return { unlockedBy: new Set(), ominous };
}
