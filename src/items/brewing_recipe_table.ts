export type PotionBase = 'water' | 'awkward' | 'thick' | 'mundane';

export interface Brew {
  from: string;
  ingredient: string;
  to: string;
}

const RECIPES: Brew[] = [
  { from: 'water', ingredient: 'nether_wart', to: 'awkward' },
  { from: 'water', ingredient: 'glowstone_dust', to: 'thick' },
  // Wiki: water + fermented_spider_eye → weakness (NOT mundane).
  { from: 'water', ingredient: 'fermented_spider_eye', to: 'weakness' },
  // Wiki (minecraft.wiki/w/Mundane_Potion): "Redstone Dust; Breeze
  // Rod; Stone; Slime Block; Cobweb; Magma Cream; Rabbit's Foot;
  // Sugar; Glistering Melon Slice; Spider Eye; Ghast Tear; Blaze
  // Powder" — all of these on water make a mundane (no-effect)
  // potion. Old table had only redstone, leaving every other wiki
  // mundane-recipe undefined.
  { from: 'water', ingredient: 'redstone', to: 'mundane' },
  { from: 'water', ingredient: 'breeze_rod', to: 'mundane' },
  { from: 'water', ingredient: 'stone', to: 'mundane' },
  { from: 'water', ingredient: 'slime_block', to: 'mundane' },
  { from: 'water', ingredient: 'cobweb', to: 'mundane' },
  { from: 'water', ingredient: 'magma_cream', to: 'mundane' },
  { from: 'water', ingredient: 'rabbit_foot', to: 'mundane' },
  { from: 'water', ingredient: 'sugar', to: 'mundane' },
  { from: 'water', ingredient: 'glistering_melon_slice', to: 'mundane' },
  { from: 'water', ingredient: 'spider_eye', to: 'mundane' },
  { from: 'water', ingredient: 'ghast_tear', to: 'mundane' },
  { from: 'water', ingredient: 'blaze_powder', to: 'mundane' },
  { from: 'awkward', ingredient: 'sugar', to: 'swiftness' },
  { from: 'awkward', ingredient: 'rabbit_foot', to: 'leaping' },
  { from: 'awkward', ingredient: 'blaze_powder', to: 'strength' },
  { from: 'awkward', ingredient: 'ghast_tear', to: 'regeneration' },
  { from: 'awkward', ingredient: 'spider_eye', to: 'poison' },
  { from: 'awkward', ingredient: 'magma_cream', to: 'fire_resistance' },
  { from: 'awkward', ingredient: 'glistering_melon_slice', to: 'healing' },
  { from: 'awkward', ingredient: 'pufferfish', to: 'water_breathing' },
  { from: 'awkward', ingredient: 'golden_carrot', to: 'night_vision' },
  { from: 'awkward', ingredient: 'phantom_membrane', to: 'slow_falling' },
  { from: 'awkward', ingredient: 'turtle_shell', to: 'turtle_master' },
  // Direct awkward → weakness path also exists per wiki.
  { from: 'awkward', ingredient: 'fermented_spider_eye', to: 'weakness' },
  { from: 'healing', ingredient: 'fermented_spider_eye', to: 'harming' },
  { from: 'poison', ingredient: 'fermented_spider_eye', to: 'harming' },
  { from: 'night_vision', ingredient: 'fermented_spider_eye', to: 'invisibility' },
  { from: 'swiftness', ingredient: 'fermented_spider_eye', to: 'slowness' },
  // Wiki: leaping + fermented_spider_eye → slowness IV (similar to
  // swiftness corruption). Was missing.
  { from: 'leaping', ingredient: 'fermented_spider_eye', to: 'slowness' },
];

export function brewResult(base: string, ingredient: string): string | undefined {
  const match = RECIPES.find((r) => r.from === base && r.ingredient === ingredient);
  return match?.to;
}

// Wiki: redstone extends duration of timed potions only. Healing and
// harming are instant (no duration); water/awkward/mundane/thick have
// no effect or are intermediates. Old code missed mundane + thick.
const NON_EXTENDABLE = new Set(['water', 'awkward', 'mundane', 'thick', 'healing', 'harming']);
export function canExtendWithRedstone(potion: string): boolean {
  return !NON_EXTENDABLE.has(potion);
}

// Wiki: glowstone amplifies level-bearing potions only. Duration-only
// potions (night_vision, invisibility, fire_resistance, water_breathing,
// slow_falling, weakness) can't be amplified, plus the no-effect bases.
// Old code only excluded water/awkward/mundane.
const NON_AMPLIFIABLE = new Set([
  'water',
  'awkward',
  'mundane',
  'thick',
  'night_vision',
  'invisibility',
  'fire_resistance',
  'water_breathing',
  'slow_falling',
  'weakness',
]);
export function canAmplifyWithGlowstone(potion: string): boolean {
  return !NON_AMPLIFIABLE.has(potion);
}
