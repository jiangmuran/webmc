// Suspicious stew. Crafted with a mushroom stew + a flower; the flower
// determines the effect applied on eat.
//
// Wiki (minecraft.wiki/w/Suspicious_Stew): "Eating one restores 6
// hunger and 7.2 hunger saturation." Old `eat(3, 7.2)` had hunger=3,
// half the wiki value — a single eat restored only half the hunger
// canon expects.
//
// Wiki effect-duration update (24w45a): Java durations now match
// Bedrock — Fire Resistance 3 s, Blindness 11 s, Weakness 7 s,
// Regeneration 7 s, Jump Boost 5 s, Wither 7 s, Poison 11 s.
// Old durations (8/2/9/8/12/6/8) drifted 1-3 seconds on most effects.

export type StewFlower =
  | 'poppy'
  | 'dandelion'
  | 'blue_orchid'
  | 'oxeye_daisy'
  | 'allium'
  | 'tulip'
  | 'azure_bluet'
  | 'lily_of_the_valley'
  | 'cornflower'
  | 'wither_rose';

export interface StewEffect {
  id: string;
  durationSec: number;
  amplifier: number;
}

export const STEW_EFFECTS: Record<StewFlower, StewEffect> = {
  poppy: { id: 'night_vision', durationSec: 5, amplifier: 0 },
  dandelion: { id: 'saturation', durationSec: 0.35, amplifier: 0 },
  blue_orchid: { id: 'saturation', durationSec: 0.35, amplifier: 0 },
  oxeye_daisy: { id: 'regeneration', durationSec: 7, amplifier: 0 },
  allium: { id: 'fire_resistance', durationSec: 3, amplifier: 0 },
  tulip: { id: 'weakness', durationSec: 7, amplifier: 0 },
  azure_bluet: { id: 'blindness', durationSec: 11, amplifier: 0 },
  lily_of_the_valley: { id: 'poison', durationSec: 11, amplifier: 0 },
  cornflower: { id: 'jump_boost', durationSec: 5, amplifier: 0 },
  wither_rose: { id: 'wither', durationSec: 7, amplifier: 0 },
};

export interface StewConsumer {
  applyEffect(id: string, amplifier: number, durationSec: number): void;
  eat(hunger: number, saturation: number): void;
}

export function eatSuspiciousStew(flower: StewFlower, consumer: StewConsumer): void {
  const eff = STEW_EFFECTS[flower];
  consumer.eat(6, 7.2);
  consumer.applyEffect(eff.id, eff.amplifier, eff.durationSec);
}
