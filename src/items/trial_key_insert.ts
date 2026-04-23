export type TrialKey = 'trial_key' | 'ominous_trial_key';

export interface VaultState {
  kind: 'normal' | 'ominous';
  unlocked: boolean;
  claimedBy: readonly string[];
}

export function canInsert(vault: VaultState, key: TrialKey, player: string): boolean {
  if (vault.unlocked) return false;
  if (vault.claimedBy.includes(player)) return false;
  if (vault.kind === 'ominous') return key === 'ominous_trial_key';
  return key === 'trial_key';
}

export function insert(vault: VaultState, key: TrialKey, player: string): VaultState {
  if (!canInsert(vault, key, player)) return vault;
  return { ...vault, unlocked: true, claimedBy: [...vault.claimedBy, player] };
}
