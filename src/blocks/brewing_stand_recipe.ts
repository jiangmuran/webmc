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
  if (c.base === 'water' && c.ingredient === 'nether_wart') return 'awkward';
  if (c.base === 'awkward') {
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
      case 'fermented_spider_eye':
        return 'invisibility';
    }
  }
  return undefined;
}

export function fuelUsedPerBrew(): number {
  return 1;
}
