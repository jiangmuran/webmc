// Potion ingredient transforms (simplified brewing recipes).

export type PotionKind =
  | 'awkward'
  | 'night_vision'
  | 'invisibility'
  | 'leaping'
  | 'fire_resistance'
  | 'swiftness'
  | 'slowness'
  | 'water_breathing'
  | 'healing'
  | 'harming'
  | 'poison'
  | 'regeneration'
  | 'strength'
  | 'weakness'
  | 'turtle_master'
  | 'slow_falling';

export interface Brew {
  input: PotionKind | 'water' | 'awkward';
  ingredient: string;
}

// Wiki (minecraft.wiki/w/Brewing): the fermented-eye corruption family
// also covers `poison + fermented_spider_eye → harming` and
// `leaping + fermented_spider_eye → slowness`. Old TABLE only listed
// half the corruption chain, leaving poison and leaping brews with
// fermented spider eye returning null. Sibling brewing_recipe_table.ts
// already has both.
const TABLE: Record<string, PotionKind> = {
  'water+nether_wart': 'awkward',
  'awkward+golden_carrot': 'night_vision',
  'night_vision+fermented_spider_eye': 'invisibility',
  'awkward+rabbit_foot': 'leaping',
  'leaping+fermented_spider_eye': 'slowness',
  'awkward+magma_cream': 'fire_resistance',
  'awkward+sugar': 'swiftness',
  'swiftness+fermented_spider_eye': 'slowness',
  'awkward+pufferfish': 'water_breathing',
  'awkward+glistering_melon_slice': 'healing',
  'healing+fermented_spider_eye': 'harming',
  'awkward+spider_eye': 'poison',
  'poison+fermented_spider_eye': 'harming',
  'awkward+ghast_tear': 'regeneration',
  'awkward+blaze_powder': 'strength',
  'awkward+fermented_spider_eye': 'weakness',
  'awkward+turtle_shell': 'turtle_master',
  'awkward+phantom_membrane': 'slow_falling',
};

export function apply(b: Brew): PotionKind | null {
  return TABLE[`${b.input}+${b.ingredient}`] ?? null;
}
