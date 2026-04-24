export type BeaconTier = 0 | 1 | 2 | 3 | 4;

const VALID_BASES = new Set<string>([
  'iron_block',
  'gold_block',
  'diamond_block',
  'emerald_block',
  'netherite_block',
]);

export function pyramidLevels(baseCounts: readonly number[]): BeaconTier {
  const valid = baseCounts.every((c, idx) => {
    const sideSize = (idx + 1) * 2 + 1;
    return c >= sideSize * sideSize;
  });
  if (!valid) return 0;
  return Math.min(4, baseCounts.length) as BeaconTier;
}

export function effectRange(tier: BeaconTier): number {
  if (tier === 0) return 0;
  return tier * 10 + 10;
}

export function secondaryAvailable(tier: BeaconTier): boolean {
  return tier === 4;
}

export function isValidBase(blockId: string): boolean {
  return VALID_BASES.has(blockId);
}
