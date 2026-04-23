export type GoatHornVariant =
  | 'ponder'
  | 'sing'
  | 'seek'
  | 'feel'
  | 'admire'
  | 'call'
  | 'yearn'
  | 'dream';

export const ANCIENT_CITY_VARIANTS: GoatHornVariant[] = ['ponder', 'sing', 'seek', 'feel'];
export const GOAT_VARIANTS: GoatHornVariant[] = ['admire', 'call', 'yearn', 'dream'];

export function isAncientCityHorn(v: GoatHornVariant): boolean {
  return ANCIENT_CITY_VARIANTS.includes(v);
}

export function pitchOf(v: GoatHornVariant): number {
  const idx = [...ANCIENT_CITY_VARIANTS, ...GOAT_VARIANTS].indexOf(v);
  return 0.5 + idx * 0.125;
}
