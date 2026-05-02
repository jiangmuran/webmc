export type BaseIngredient =
  | 'nether_wart'
  | 'glowstone'
  | 'redstone'
  | 'gunpowder'
  | 'dragon_breath';

export type Potion =
  | 'water'
  | 'awkward'
  | 'thick'
  | 'mundane'
  | 'healing'
  | 'swiftness'
  | 'strength'
  | 'fire_resistance'
  | 'night_vision'
  | 'poison'
  | 'regeneration'
  | 'leaping'
  | 'water_breathing'
  | 'invisibility';

export const BREW_TIME_TICKS = 400;
export const BLAZE_FUEL_POWDER = 20;

export interface BrewCtx {
  base: Potion;
  ingredient: string;
}

export function resultPotion(c: BrewCtx): Potion | undefined {
  // Wiki (minecraft.wiki/w/Brewing): water-base recipes. Nether wart →
  // awkward (the standard effect base). Redstone → mundane, glowstone
  // dust → thick (the two canonical "modifier on water" potions).
  // Sibling items/brewing_stand_recipe.ts had these; this one was
  // missing them, so a glowstone-on-water brew silently returned
  // undefined and a redstone-on-water brew was no-op.
  if (c.base === 'water') {
    if (c.ingredient === 'nether_wart') return 'awkward';
    if (c.ingredient === 'redstone') return 'mundane';
    if (c.ingredient === 'glowstone_dust') return 'thick';
  }
  if (c.base === 'awkward') {
    // Wiki (minecraft.wiki/w/Brewing): effect ingredients applied to
    // awkward give effect potions. Per minecraft.wiki/w/Potion_of_Invisibility,
    // invisibility is brewed from Potion of Night Vision +
    // fermented_spider_eye, NOT directly from awkward — the previous
    // entry was wrong. Glistering melon → healing was also missing
    // (the canonical awkward base for healing).
    switch (c.ingredient) {
      case 'sugar':
        return 'swiftness';
      case 'blaze_powder':
        return 'strength';
      case 'magma_cream':
        return 'fire_resistance';
      case 'golden_carrot':
        return 'night_vision';
      case 'spider_eye':
        return 'poison';
      case 'ghast_tear':
        return 'regeneration';
      case 'rabbit_foot':
        return 'leaping';
      case 'pufferfish':
        return 'water_breathing';
      case 'glistering_melon':
      case 'glistering_melon_slice':
        return 'healing';
    }
  }
  // Wiki: fermented_spider_eye corrupts an existing potion — applied
  // to night_vision it yields invisibility (handled when base ===
  // 'night_vision'), applied to water it yields weakness. We only
  // model the first transition to invisibility here; full corruption
  // chains are handled in items/potion_corrupt.
  if (c.base === 'night_vision' && c.ingredient === 'fermented_spider_eye') {
    return 'invisibility';
  }
  return undefined;
}

export function fuelUsedPerBrew(): number {
  return 1;
}
