export const TIER_MAX = 4;

export function tierFromMaterialCount(count: number): number {
  if (count < 9) return 0;
  if (count < 34) return 1;
  if (count < 83) return 2;
  if (count < 164) return 3;
  return 4;
}

export function rangeBlocks(tier: number): number {
  return 10 + tier * 10;
}

export function canGiveSecondary(tier: number): boolean {
  return tier >= TIER_MAX;
}

export function durationTicks(tier: number): number {
  return (9 + tier * 2) * 20;
}
