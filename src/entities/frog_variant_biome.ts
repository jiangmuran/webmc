export type FrogVariant = 'temperate' | 'warm' | 'cold';

export function frogVariantForTemperature(biomeTemp: number): FrogVariant {
  if (biomeTemp < 0.15) return 'cold';
  if (biomeTemp > 1.5) return 'warm';
  return 'temperate';
}

// Wiki (minecraft.wiki/w/Froglight): each frog variant produces a
// thematically-matching froglight:
//   temperate (white)  → pearlescent
//   warm     (orange)  → ochre
//   cold     (green)   → verdant
// Old map had temperate↔warm swapped (returned ochre for temperate
// and pearlescent for warm).
export function froglightColorFor(variant: FrogVariant, _prey: 'small_magma_cube'): string {
  if (variant === 'warm') return 'ochre_froglight';
  if (variant === 'cold') return 'verdant_froglight';
  return 'pearlescent_froglight';
}
