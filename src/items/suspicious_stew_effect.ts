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

// Wiki (minecraft.wiki/w/Suspicious_Stew, History 24w45a): Java
// durations now match Bedrock:
//   Fire Resistance 3 s = 60 ticks
//   Weakness        7 s = 140 ticks
//   Regeneration    7 s = 140 ticks
//   Jump Boost      5 s = 100 ticks
//   Wither          7 s = 140 ticks
//   Blindness      11 s = 220 ticks
//   Poison         11 s = 220 ticks
//
// Old durations were drifted 1-3 seconds high or low. Saturation is
// not in the 24w45a change list; canonical Saturation effect duration
// is 7 ticks (0.35 s), which heals a flat 7.2 saturation points
// instantly thanks to the +1 Saturation Amplifier 0 = +1 saturation
// per second per amplifier, applied per game tick. Both saturation
// rows now match (was 7 + 140 — inconsistent within itself).
const EFFECT_BY_FLOWER: Record<FlowerSource, { id: string; durationTicks: number }> = {
  dandelion: { id: 'saturation', durationTicks: 7 },
  poppy: { id: 'night_vision', durationTicks: 100 },
  blue_orchid: { id: 'saturation', durationTicks: 7 },
  allium: { id: 'fire_resistance', durationTicks: 60 },
  azure_bluet: { id: 'blindness', durationTicks: 220 },
  tulip: { id: 'weakness', durationTicks: 140 },
  oxeye_daisy: { id: 'regeneration', durationTicks: 140 },
  cornflower: { id: 'jump_boost', durationTicks: 100 },
  lily_of_the_valley: { id: 'poison', durationTicks: 220 },
  wither_rose: { id: 'wither', durationTicks: 140 },
};

export function effectFromSource(source: FlowerSource): { id: string; durationTicks: number } {
  return EFFECT_BY_FLOWER[source];
}
