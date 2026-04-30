export type FrogVariant = 'temperate' | 'warm' | 'cold';

// Wiki (minecraft.wiki/w/Frog#Spawning): variant breakpoints are
// cold ≤ 0.15 and warm ≥ 1.0. Old code used > 1.5 as the warm cutoff,
// so a savanna (~1.2) produced a temperate frog instead of the
// warm/orange frog the wiki specifies. Sibling frog_variant.ts
// already uses ≥ 1.0.
export function frogVariantForTemperature(biomeTemp: number): FrogVariant {
  if (biomeTemp <= 0.15) return 'cold';
  if (biomeTemp >= 1.0) return 'warm';
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
