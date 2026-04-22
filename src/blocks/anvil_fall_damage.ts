// Anvil falling. Damages any entity passing through each cell it
// falls through. Caps at 40 HP. Not mitigated by armor.

export const DAMAGE_PER_BLOCK = 2;
export const MAX_DAMAGE = 40;

export function anvilPassThroughDamage(fallDistanceBlocks: number): number {
  if (fallDistanceBlocks <= 1) return 0;
  const d = Math.floor((fallDistanceBlocks - 1) * DAMAGE_PER_BLOCK);
  return Math.min(MAX_DAMAGE, Math.max(0, d));
}

// On landing, anvil has 12% chance to degrade. Damaged ≤ chipped ≤ normal.
export type AnvilKind = 'webmc:anvil' | 'webmc:chipped_anvil' | 'webmc:damaged_anvil';

const DEGRADE: Record<AnvilKind, AnvilKind | null> = {
  'webmc:anvil': 'webmc:chipped_anvil',
  'webmc:chipped_anvil': 'webmc:damaged_anvil',
  'webmc:damaged_anvil': null,
};

export const DEGRADE_CHANCE = 0.12;

export function tryDegrade(kind: AnvilKind, rand: () => number): AnvilKind | 'destroyed' | null {
  if (rand() >= DEGRADE_CHANCE) return null;
  const next = DEGRADE[kind];
  return next ?? 'destroyed';
}
