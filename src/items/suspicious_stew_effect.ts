export type FlowerSource =
  | 'dandelion'
  | 'poppy'
  | 'blue_orchid'
  | 'allium'
  | 'azure_bluet'
  | 'tulip'
  | 'oxeye_daisy'
  | 'cornflower'
  | 'lily_of_the_valley'
  | 'wither_rose';

const EFFECT_BY_FLOWER: Record<FlowerSource, { id: string; durationTicks: number }> = {
  dandelion: { id: 'saturation', durationTicks: 7 },
  poppy: { id: 'night_vision', durationTicks: 100 },
  blue_orchid: { id: 'saturation', durationTicks: 140 },
  allium: { id: 'fire_resistance', durationTicks: 80 },
  azure_bluet: { id: 'blindness', durationTicks: 160 },
  tulip: { id: 'weakness', durationTicks: 180 },
  oxeye_daisy: { id: 'regeneration', durationTicks: 160 },
  cornflower: { id: 'jump_boost', durationTicks: 120 },
  lily_of_the_valley: { id: 'poison', durationTicks: 240 },
  wither_rose: { id: 'wither', durationTicks: 160 },
};

export function effectFromSource(source: FlowerSource): { id: string; durationTicks: number } {
  return EFFECT_BY_FLOWER[source];
}
