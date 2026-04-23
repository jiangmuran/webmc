// End biomes. Main island + outer rings + void.

export type EndBiome =
  | 'the_end'
  | 'end_highlands'
  | 'end_midlands'
  | 'end_barrens'
  | 'small_end_islands';

export const END_BIOMES: EndBiome[] = [
  'the_end',
  'end_highlands',
  'end_midlands',
  'end_barrens',
  'small_end_islands',
];

export function biomeForRadius(r: number): EndBiome {
  if (r < 1000) return 'the_end';
  if (r < 4000) return 'small_end_islands';
  if (r < 8000) return 'end_highlands';
  if (r < 12000) return 'end_midlands';
  return 'end_barrens';
}

export function hasChorusPlants(b: EndBiome): boolean {
  return b !== 'the_end';
}

export function endCityEligible(b: EndBiome): boolean {
  return b === 'end_highlands' || b === 'end_midlands';
}
