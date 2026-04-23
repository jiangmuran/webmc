// Frogs that eat small magma cubes produce froglights (variant by frog).

export type FrogVariant = 'temperate' | 'warm' | 'cold';
export type FroglightColor = 'ochre' | 'pearlescent' | 'verdant';

export function froglightFor(variant: FrogVariant): FroglightColor {
  if (variant === 'temperate') return 'ochre';
  if (variant === 'warm') return 'pearlescent';
  return 'verdant';
}

export function magmaCubeEaten(size: number): boolean {
  return size === 1;
}

export const FROGLIGHT_LIGHT_LEVEL = 15;
