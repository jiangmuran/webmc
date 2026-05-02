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

// Wiki (minecraft.wiki/w/Beacon): "Every 4 seconds, the selected
// powers are applied with a duration of 9 seconds, plus 2 seconds
// per pyramid level." The wiki's own duration table backs this:
// tier 1 = 11 s, tier 2 = 13 s, tier 3 = 15 s, tier 4 = 17 s.
// Formula: `9 + tier * 2` seconds. The previous "fix" mis-read the
// wiki and shipped `9 + (tier - 1) * 2`, dropping every duration
// by 2 s (tier 1 became 9 s — exactly the application interval,
// which would let effects expire mid-cycle).
export function durationTicks(tier: number): number {
  if (tier <= 0) return 0;
  return (9 + tier * 2) * 20;
}
