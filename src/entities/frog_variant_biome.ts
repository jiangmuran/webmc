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

// Wiki (minecraft.wiki/w/Froglight#Acquisition): canonical mapping is
//   Warm      → Pearlescent
//   Temperate → Ochre
//   Cold      → Verdant
// A previous fix swapped warm↔temperate based on a thematic guess
// (orange frog ≈ ochre, white frog ≈ pearlescent), but the wiki
// table reverses that intuition: warm produces pearlescent and
// temperate produces ochre.
export function froglightColorFor(variant: FrogVariant, _prey: 'small_magma_cube'): string {
  if (variant === 'warm') return 'pearlescent_froglight';
  if (variant === 'cold') return 'verdant_froglight';
  return 'ochre_froglight';
}
