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
  // Mundane comes from water + redstone_dust, glowstone_dust, sugar, etc.
  // Was 'mundane' — non-vanilla.
  { from: 'water', ingredient: 'fermented_spider_eye', to: 'weakness' },
  // Mundane potion path — water + redstone_dust is the canonical recipe.
  { from: 'water', ingredient: 'redstone', to: 'mundane' },
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

export function canExtendWithRedstone(potion: string): boolean {
  return potion !== 'healing' && potion !== 'harming' && potion !== 'water' && potion !== 'awkward';
}

export function canAmplifyWithGlowstone(potion: string): boolean {
  return potion !== 'water' && potion !== 'awkward' && potion !== 'mundane';
}
