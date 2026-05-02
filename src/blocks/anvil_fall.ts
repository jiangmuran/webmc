// Falling anvil damage + durability decay. Damage scales with fall
// distance (capped at 40 HP per wiki). Anvil damage state cycles
// through three tiers (intact / chipped / damaged) and breaks at
// tier 3.

export type AnvilTier = 'intact' | 'chipped' | 'damaged' | 'broken';

export interface AnvilState {
  tier: AnvilTier;
}

export function makeAnvil(): AnvilState {
  return { tier: 'intact' };
}

// Wiki (minecraft.wiki/w/Anvil#Falling_anvils): "The damage amount
// depends on fall distance: 2 hp per block fallen after the first
// (e.g., an anvil that falls 4 blocks deals 6 hp damage). The damage
// is capped at 40 hp, no matter how far the anvil falls." Old cap
// was 20 — half the wiki value, letting late-game players walk
// under a 30-block-falling anvil and survive on full diamond armor.
// Sibling anvil_fall_damage.ts already capped at 40.
export const ANVIL_DAMAGE_CAP = 40;
export function anvilFallDamage(fallBlocks: number): number {
  return Math.min(ANVIL_DAMAGE_CAP, Math.max(0, fallBlocks * 2 - 2));
}

// Wiki (minecraft.wiki/w/Anvil#Falling_anvils): "If it falls from a
// height greater than one block, the chance of degrading by one stage
// is 5% × the number of blocks fallen." 12% is the per-USE chance
// (anvil_damage_chain.ts), not the fall-context chance — old code
// used 12% regardless of distance, so a 1-block fall could degrade
// (wiki: cannot) and a 20-block fall had the same odds as a 2-block
// one (wiki: 100% vs 10%).
export const FALL_DEGRADE_PER_BLOCK = 0.05;
const NEXT_TIER: Record<AnvilTier, AnvilTier> = {
  intact: 'chipped',
  chipped: 'damaged',
  damaged: 'broken',
  broken: 'broken',
};

export function maybeDegrade(
  state: AnvilState,
  fallBlocks: number,
  rng: () => number = Math.random,
): boolean {
  if (state.tier === 'broken') return false;
  if (fallBlocks <= 1) return false;
  const chance = Math.min(1, FALL_DEGRADE_PER_BLOCK * fallBlocks);
  if (rng() < chance) {
    state.tier = NEXT_TIER[state.tier];
    return true;
  }
  return false;
}
