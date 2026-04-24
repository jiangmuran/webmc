export function fogColorForBiome(
  biome: string,
  dayPhase: 'day' | 'night',
): [number, number, number] {
  if (dayPhase === 'night') return [0.05, 0.07, 0.15];
  if (biome === 'nether_wastes') return [0.2, 0.03, 0.03];
  if (biome === 'crimson_forest') return [0.2, 0.03, 0.03];
  if (biome === 'warped_forest') return [0.09, 0.19, 0.23];
  if (biome === 'soul_sand_valley') return [0.06, 0.2, 0.2];
  if (biome === 'basalt_deltas') return [0.27, 0.27, 0.27];
  if (biome === 'the_end') return [0, 0, 0];
  return [0.7, 0.82, 0.99];
}

export function fogStartDistance(biome: string): number {
  if (biome === 'basalt_deltas') return 6;
  if (biome === 'soul_sand_valley') return 10;
  return 60;
}
