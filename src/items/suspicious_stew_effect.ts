// Wiki (minecraft.wiki/w/Suspicious_Stew): canonical flower-to-effect
// table. 1.20 added torchflower (Night Vision) and 1.21.4 added the
// eyeblossoms (Open: Blindness, same duration as azure bluet per
// 24w46a; Closed: Nausea). Old union omitted all three — feeding a
// brown mooshroom one of those flowers produced no stew effect even
// though the wiki recipes accept them.
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
  | 'wither_rose'
  | 'torchflower'
  | 'open_eyeblossom'
  | 'closed_eyeblossom';

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
  // 1.20 addition (wiki Suspicious_Stew History 23w12a):
  // Torchflower → Night Vision (matches poppy, 5 s = 100 ticks).
  torchflower: { id: 'night_vision', durationTicks: 100 },
  // 1.21.4 addition (24w46a): open_eyeblossom → Blindness with the
  // same 11 s duration as azure_bluet.
  open_eyeblossom: { id: 'blindness', durationTicks: 220 },
  // 1.21.4 addition: closed_eyeblossom → Nausea. Wiki history
  // doesn't pin the duration explicitly; the only stew-source nausea
  // effect; Bedrock-parity for nausea-style stews is 7 s = 140 ticks.
  closed_eyeblossom: { id: 'nausea', durationTicks: 140 },
};

export function effectFromSource(source: FlowerSource): { id: string; durationTicks: number } {
  return EFFECT_BY_FLOWER[source];
}
