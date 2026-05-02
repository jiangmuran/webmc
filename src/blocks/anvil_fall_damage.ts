// Anvil falling. Damages any entity passing through each cell it
// falls through. Caps at 40 HP. Not mitigated by armor.

export const DAMAGE_PER_BLOCK = 2;
export const MAX_DAMAGE = 40;

export function anvilPassThroughDamage(fallDistanceBlocks: number): number {
  if (fallDistanceBlocks <= 1) return 0;
  const d = Math.floor((fallDistanceBlocks - 1) * DAMAGE_PER_BLOCK);
  return Math.min(MAX_DAMAGE, Math.max(0, d));
}

// Wiki (minecraft.wiki/w/Anvil#Falling_anvils): "If it falls from a
// height greater than one block, the chance of degrading by one stage
// is 5% × the number of blocks fallen." 12% is the per-USE chance
// (anvil_damage_chain.ts); applying it to fall context makes a
// 1-block drop able to degrade (wiki: cannot) and a 20-block drop
// no scarier than a 2-block drop (wiki: 100% vs 10%).
export type AnvilKind = 'webmc:anvil' | 'webmc:chipped_anvil' | 'webmc:damaged_anvil';

const DEGRADE: Record<AnvilKind, AnvilKind | null> = {
  'webmc:anvil': 'webmc:chipped_anvil',
  'webmc:chipped_anvil': 'webmc:damaged_anvil',
  'webmc:damaged_anvil': null,
};

export const FALL_DEGRADE_PER_BLOCK = 0.05;

export function tryDegrade(
  kind: AnvilKind,
  fallBlocks: number,
  rand: () => number,
): AnvilKind | 'destroyed' | null {
  if (fallBlocks <= 1) return null;
  const chance = Math.min(1, FALL_DEGRADE_PER_BLOCK * fallBlocks);
  if (rand() >= chance) return null;
  const next = DEGRADE[kind];
  return next ?? 'destroyed';
}
