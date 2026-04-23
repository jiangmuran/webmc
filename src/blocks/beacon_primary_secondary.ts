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

export function effectRangeBlocks(c: BeaconCtx): number {
  return 10 + Math.max(0, c.tier - 1) * 10;
}
