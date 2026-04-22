// Ocean biome selection by latitude + depth. Warm / lukewarm / normal
// / cold / frozen, crossed with shallow vs deep.

export type OceanVariant =
  | 'warm'
  | 'lukewarm'
  | 'normal'
  | 'cold'
  | 'frozen'
  | 'deep_warm'
  | 'deep_lukewarm'
  | 'deep_normal'
  | 'deep_cold'
  | 'deep_frozen';

export interface OceanQuery {
  latTemperature: number; // -1..1
  isDeep: boolean;
}

export function oceanVariant(q: OceanQuery): OceanVariant {
  let temperature: 'warm' | 'lukewarm' | 'normal' | 'cold' | 'frozen';
  if (q.latTemperature > 0.8) temperature = 'warm';
  else if (q.latTemperature > 0.4) temperature = 'lukewarm';
  else if (q.latTemperature > 0) temperature = 'normal';
  else if (q.latTemperature > -0.5) temperature = 'cold';
  else temperature = 'frozen';

  if (q.isDeep) {
    return ('deep_' + temperature) as OceanVariant;
  }
  return temperature;
}

// Fish spawn lookup per variant.
const FISH_BY_VARIANT: Record<string, string[]> = {
  warm: ['tropical_fish'],
  lukewarm: ['salmon', 'tropical_fish'],
  normal: ['cod', 'salmon'],
  cold: ['cod', 'salmon'],
  frozen: ['cod'],
};

export function fishFor(v: OceanVariant): string[] {
  const base = v.replace(/^deep_/, '');
  return FISH_BY_VARIANT[base] ?? [];
}
