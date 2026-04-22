// Brewing stand. Ingredient + base potion → output potion. Blaze
// powder fuel lasts 20 operations. Each brew takes 400 ticks (20s).

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
  | 'luck';

const INGREDIENT_TABLE: Record<string, Partial<Record<BaseKind, BaseKind>>> = {
  'webmc:nether_wart': { water: 'awkward' },
  'webmc:glistering_melon_slice': { awkward: 'healing' },
  'webmc:sugar': { awkward: 'speed' },
  'webmc:blaze_powder': { awkward: 'strength' },
  'webmc:ghast_tear': { awkward: 'regeneration' },
  'webmc:spider_eye': { awkward: 'poison', healing: 'harming' },
  'webmc:golden_carrot': { awkward: 'night_vision' },
  'webmc:fermented_spider_eye': {
    night_vision: 'invisibility',
    speed: 'slowness',
    leaping: 'slowness',
  },
  'webmc:magma_cream': { awkward: 'fire_resistance' },
  'webmc:pufferfish': { awkward: 'water_breathing' },
  'webmc:rabbit_foot': { awkward: 'leaping' },
  'webmc:turtle_shell_scute': { awkward: 'turtle_master' },
  'webmc:phantom_membrane': { awkward: 'slow_falling' },
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
