export const TIER_MAX = 4;

export function tierFromMaterialCount(count: number): number {
  if (count < 9) return 0;
  if (count < 34) return 1;
  if (count < 83) return 2;
  if (count < 164) return 3;
  return 4;
}

// Wiki (minecraft.wiki/w/Beacon): range = 10 + tier * 10 for tier ≥ 1.
// Tier 0 (no pyramid) has no effect → 0 blocks (formula returned 10).
export function rangeBlocks(tier: number): number {
  if (tier <= 0) return 0;
  return 10 + tier * 10;
}

export function canGiveSecondary(tier: number): boolean {
  return tier >= TIER_MAX;
}

// Wiki (minecraft.wiki/w/Beacon#Effects): effect duration is
// 9 + (tier - 1) * 2 seconds at tier ≥ 1 — so tiers 1-4 give
// 9 / 11 / 13 / 15 s. Old formula added 2 s at every tier and gave
// 11 s at tier 1 (wiki: 9 s).
export function durationTicks(tier: number): number {
  if (tier <= 0) return 0;
  return (9 + (tier - 1) * 2) * 20;
}
