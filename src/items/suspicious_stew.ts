// Suspicious stew. Crafted with a mushroom stew + a flower; the flower
// determines the effect applied on eat. Single-use food (3 hunger, 7.2
// saturation) with a random duration effect.

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
  oxeye_daisy: { id: 'regeneration', durationSec: 8, amplifier: 0 },
  allium: { id: 'fire_resistance', durationSec: 2, amplifier: 0 },
  tulip: { id: 'weakness', durationSec: 9, amplifier: 0 },
  azure_bluet: { id: 'blindness', durationSec: 8, amplifier: 0 },
  lily_of_the_valley: { id: 'poison', durationSec: 12, amplifier: 0 },
  cornflower: { id: 'jump_boost', durationSec: 6, amplifier: 0 },
  wither_rose: { id: 'wither', durationSec: 8, amplifier: 0 },
};

export interface StewConsumer {
  applyEffect(id: string, amplifier: number, durationSec: number): void;
  eat(hunger: number, saturation: number): void;
}

export function eatSuspiciousStew(flower: StewFlower, consumer: StewConsumer): void {
  const eff = STEW_EFFECTS[flower];
  consumer.eat(3, 7.2);
  consumer.applyEffect(eff.id, eff.amplifier, eff.durationSec);
}
