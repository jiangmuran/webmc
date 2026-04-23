export type HornVariant =
  | 'seek'
  | 'feel'
  | 'admire'
  | 'call'
  | 'yearn'
  | 'dream'
  | 'sing'
  | 'ponder';

export function isAncientCityHorn(v: HornVariant): boolean {
  return v === 'ponder' || v === 'sing' || v === 'seek' || v === 'feel';
}

export function isGoatDroppedHorn(v: HornVariant): boolean {
  return !isAncientCityHorn(v);
}

export function useCooldownTicks(): number {
  return 140;
}

export function audibleRangeBlocks(): number {
  return 256;
}
