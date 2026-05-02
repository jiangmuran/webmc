export type PrimaryEffect = 'speed' | 'haste' | 'resistance' | 'jump_boost' | 'strength';
export type SecondaryEffect = 'regeneration';

export interface BeaconCtx {
  tier: number;
  primary?: PrimaryEffect;
  secondary?: SecondaryEffect;
}

export function canSetSecondary(c: BeaconCtx): boolean {
  return c.tier >= 4;
}

export function availablePrimaries(c: BeaconCtx): PrimaryEffect[] {
  if (c.tier >= 3) return ['speed', 'haste', 'resistance', 'jump_boost', 'strength'];
  if (c.tier === 2) return ['speed', 'haste', 'resistance', 'jump_boost'];
  if (c.tier === 1) return ['speed', 'haste'];
  return [];
}

// Wiki: tier 1 → 20 blocks, tier 4 → 50 blocks. Formula: tier * 10 + 10.
// Was `(tier - 1) * 10 + 10` which gave 10/20/30/40 — off by 10 across
// all tiers. The other two beacon modules (beacon_effect_pyramid,
// beacon_pyramid_levels) had it right.
export function effectRangeBlocks(c: BeaconCtx): number {
  if (c.tier <= 0) return 0;
  return c.tier * 10 + 10;
}
