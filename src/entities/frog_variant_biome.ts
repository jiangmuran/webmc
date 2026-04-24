export type FrogVariant = 'temperate' | 'warm' | 'cold';

export function frogVariantForTemperature(biomeTemp: number): FrogVariant {
  if (biomeTemp < 0.15) return 'cold';
  if (biomeTemp > 1.5) return 'warm';
  return 'temperate';
}

export function froglightColorFor(variant: FrogVariant, _prey: 'small_magma_cube'): string {
  if (variant === 'warm') return 'pearlescent_froglight';
  if (variant === 'cold') return 'verdant_froglight';
  return 'ochre_froglight';
}
