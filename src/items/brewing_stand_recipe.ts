// Brewing stand. Ingredient + base potion → output potion. Blaze
// powder fuel lasts 20 operations. Each brew takes 400 ticks (20s).

// Wiki (minecraft.wiki/w/Brewing#Effect_potions): canonical potions
// include the four 1.21 Trial Chambers additions (wind_charged,
// weaving, oozing, infested) added in 24w13a / 1.20.5+. Old union
// was missing all four.
export type BaseKind =
  | 'water'
  | 'awkward'
  | 'thick'
  | 'mundane'
  | 'healing'
  | 'harming'
  | 'speed'
  | 'slowness'
  | 'strength'
  | 'weakness'
  | 'regeneration'
  | 'poison'
  | 'night_vision'
  | 'invisibility'
  | 'fire_resistance'
  | 'water_breathing'
  | 'leaping'
  | 'turtle_master'
  | 'slow_falling'
  | 'luck'
  | 'wind_charged'
  | 'weaving'
  | 'oozing'
  | 'infested';

const INGREDIENT_TABLE: Record<string, Partial<Record<BaseKind, BaseKind>>> = {
  // Wiki (minecraft.wiki/w/Brewing): water-base recipes were missing.
  // Per the Brewing wiki "redstone → mundane, glowstone → thick,
  // fermented_spider_eye → weakness — the only modifier that can
  // convert a water bottle directly into a usable potion." Old table
  // had only water + nether_wart, so a fermented spider eye on
  // water gave nothing instead of weakness, and glowstone + water
  // didn't produce thick.
  'webmc:nether_wart': { water: 'awkward' },
  'webmc:redstone': { water: 'mundane' },
  'webmc:glowstone_dust': { water: 'thick' },
  'webmc:glistering_melon_slice': { awkward: 'healing' },
  'webmc:sugar': { awkward: 'speed' },
  'webmc:blaze_powder': { awkward: 'strength' },
  'webmc:ghast_tear': { awkward: 'regeneration' },
  'webmc:spider_eye': { awkward: 'poison', healing: 'harming' },
  'webmc:golden_carrot': { awkward: 'night_vision' },
  'webmc:fermented_spider_eye': {
    water: 'weakness',
    night_vision: 'invisibility',
    speed: 'slowness',
    leaping: 'slowness',
  },
  'webmc:magma_cream': { awkward: 'fire_resistance' },
  'webmc:pufferfish': { awkward: 'water_breathing' },
  'webmc:rabbit_foot': { awkward: 'leaping' },
  // Wiki (minecraft.wiki/w/Potion_of_the_Turtle_Master): brew turtle
  // master with TURTLE SHELL (the helmet item, id webmc:turtle_shell),
  // not a scute. Old key 'turtle_shell_scute' didn't match any
  // registered item, so this recipe was effectively unbrewable.
  'webmc:turtle_shell': { awkward: 'turtle_master' },
  'webmc:phantom_membrane': { awkward: 'slow_falling' },
  // 1.21 Trial Chambers potions (24w13a):
  'webmc:breeze_rod': { awkward: 'wind_charged' },
  'webmc:cobweb': { awkward: 'weaving' },
  'webmc:slime_block': { awkward: 'oozing' },
  'webmc:stone': { awkward: 'infested' },
};

export function brew(input: BaseKind, ingredient: string): BaseKind | null {
  const table = INGREDIENT_TABLE[ingredient];
  if (!table) return null;
  return table[input] ?? null;
}

export const BREW_TICKS = 400;
export const FUEL_USES = 20;

export interface BrewingStand {
  remainingBrewTicks: number;
  fuelUsesRemaining: number;
}

export function makeStand(): BrewingStand {
  return { remainingBrewTicks: 0, fuelUsesRemaining: 0 };
}

export function addFuel(s: BrewingStand): boolean {
  if (s.fuelUsesRemaining >= FUEL_USES) return false;
  s.fuelUsesRemaining = FUEL_USES;
  return true;
}

export interface StartQuery {
  input: BaseKind;
  ingredient: string;
}

export function startBrew(s: BrewingStand, q: StartQuery): 'started' | 'no_fuel' | 'invalid' {
  if (s.fuelUsesRemaining <= 0) return 'no_fuel';
  const out = brew(q.input, q.ingredient);
  if (!out) return 'invalid';
  s.remainingBrewTicks = BREW_TICKS;
  s.fuelUsesRemaining -= 1;
  return 'started';
}
