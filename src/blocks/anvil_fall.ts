// Falling anvil damage + durability decay. Damage scales with fall
// distance (capped at 20 HP). Anvil damage state cycles through three
// tiers (intact / chipped / damaged) and breaks at tier 3.

export type AnvilTier = 'intact' | 'chipped' | 'damaged' | 'broken';

export interface AnvilState {
  tier: AnvilTier;
}

export function makeAnvil(): AnvilState {
  return { tier: 'intact' };
}

// MC formula: anvil damage to entity = max(fallBlocks * 2 - 2, 0), capped 20.
export function anvilFallDamage(fallBlocks: number): number {
  return Math.min(20, Math.max(0, fallBlocks * 2 - 2));
}

// Per MC, anvil has ~12% chance to degrade per use at a non-zero cost.
const DEGRADE_CHANCE = 0.12;
const NEXT_TIER: Record<AnvilTier, AnvilTier> = {
  intact: 'chipped',
  chipped: 'damaged',
  damaged: 'broken',
  broken: 'broken',
};

export function maybeDegrade(state: AnvilState, rng: () => number = Math.random): boolean {
  if (state.tier === 'broken') return false;
  if (rng() < DEGRADE_CHANCE) {
    state.tier = NEXT_TIER[state.tier];
    return true;
  }
  return false;
}
