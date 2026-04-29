// Frogs that eat small magma cubes produce froglights (variant by frog).

export type FrogVariant = 'temperate' | 'warm' | 'cold';
export type FroglightColor = 'ochre' | 'pearlescent' | 'verdant';

// Wiki (minecraft.wiki/w/Froglight): each frog variant produces a
// thematically-matching froglight:
//   temperate (white)  → pearlescent (pearl)
//   warm     (orange)  → ochre        (yellow-orange)
//   cold     (green)   → verdant      (green)
// Old mapping had temperate↔warm swapped.
export function froglightFor(variant: FrogVariant): FroglightColor {
  if (variant === 'temperate') return 'pearlescent';
  if (variant === 'warm') return 'ochre';
  return 'verdant';
}

export function magmaCubeEaten(size: number): boolean {
  return size === 1;
}

export const FROGLIGHT_LIGHT_LEVEL = 15;
