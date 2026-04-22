// Potion recipes: base (awkward/thick/mundane/water) + ingredient → named potion.
// Applying a potion calls PlayerState.applyEffect for each effect entry.

export type EffectId =
  | 'regeneration'
  | 'poison'
  | 'instant_health'
  | 'instant_damage'
  | 'swiftness'
  | 'slowness'
  | 'strength'
  | 'weakness'
  | 'fire_resistance'
  | 'night_vision';

export interface PotionEffect {
  id: EffectId;
  amplifier: number;
  durationSec: number;
}

export interface PotionDef {
  name: string;
  color: readonly [number, number, number];
  effects: readonly PotionEffect[];
}

const secs = (s: number): number => s;

export const POTIONS: Record<string, PotionDef> = {
  healing: {
    name: 'potion_of_healing',
    color: [240, 60, 80],
    effects: [{ id: 'instant_health', amplifier: 0, durationSec: secs(1) }],
  },
  harming: {
    name: 'potion_of_harming',
    color: [100, 10, 40],
    effects: [{ id: 'instant_damage', amplifier: 0, durationSec: secs(1) }],
  },
  regeneration: {
    name: 'potion_of_regeneration',
    color: [250, 90, 130],
    effects: [{ id: 'regeneration', amplifier: 0, durationSec: secs(45) }],
  },
  poison: {
    name: 'potion_of_poison',
    color: [70, 140, 30],
    effects: [{ id: 'poison', amplifier: 0, durationSec: secs(45) }],
  },
  swiftness: {
    name: 'potion_of_swiftness',
    color: [130, 200, 240],
    effects: [{ id: 'swiftness', amplifier: 0, durationSec: secs(180) }],
  },
  slowness: {
    name: 'potion_of_slowness',
    color: [90, 110, 160],
    effects: [{ id: 'slowness', amplifier: 0, durationSec: secs(90) }],
  },
  strength: {
    name: 'potion_of_strength',
    color: [200, 100, 40],
    effects: [{ id: 'strength', amplifier: 0, durationSec: secs(180) }],
  },
  weakness: {
    name: 'potion_of_weakness',
    color: [110, 110, 110],
    effects: [{ id: 'weakness', amplifier: 0, durationSec: secs(90) }],
  },
  fire_resistance: {
    name: 'potion_of_fire_resistance',
    color: [255, 150, 30],
    effects: [{ id: 'fire_resistance', amplifier: 0, durationSec: secs(180) }],
  },
  night_vision: {
    name: 'potion_of_night_vision',
    color: [30, 60, 180],
    effects: [{ id: 'night_vision', amplifier: 0, durationSec: secs(180) }],
  },
};

export interface PlayerEffectsSink {
  applyEffect(id: string, amplifier: number, durationSec: number): void;
}

export function drinkPotion(key: string, player: PlayerEffectsSink): boolean {
  const def = POTIONS[key];
  if (!def) return false;
  for (const eff of def.effects) {
    player.applyEffect(eff.id, eff.amplifier, eff.durationSec);
  }
  return true;
}

interface BrewRecipe {
  base: string; // input potion key or 'water_bottle' / 'awkward'
  ingredient: string; // item name, e.g. 'webmc:glistering_melon'
  output: string; // output potion key
}

export const BREW_RECIPES: readonly BrewRecipe[] = [
  { base: 'awkward', ingredient: 'webmc:glistering_melon', output: 'healing' },
  { base: 'awkward', ingredient: 'webmc:spider_eye', output: 'poison' },
  { base: 'awkward', ingredient: 'webmc:ghast_tear', output: 'regeneration' },
  { base: 'awkward', ingredient: 'webmc:sugar', output: 'swiftness' },
  { base: 'awkward', ingredient: 'webmc:blaze_powder', output: 'strength' },
  { base: 'awkward', ingredient: 'webmc:magma_cream', output: 'fire_resistance' },
  { base: 'awkward', ingredient: 'webmc:golden_carrot', output: 'night_vision' },
  { base: 'healing', ingredient: 'webmc:fermented_spider_eye', output: 'harming' },
  { base: 'swiftness', ingredient: 'webmc:fermented_spider_eye', output: 'slowness' },
  { base: 'regeneration', ingredient: 'webmc:fermented_spider_eye', output: 'weakness' },
];

export function brewResult(base: string, ingredient: string): string | null {
  for (const r of BREW_RECIPES) {
    if (r.base === base && r.ingredient === ingredient) return r.output;
  }
  return null;
}
