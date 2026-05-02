// Frogs that eat small magma cubes produce froglights (variant by frog).

export type FrogVariant = 'temperate' | 'warm' | 'cold';
export type FroglightColor = 'ochre' | 'pearlescent' | 'verdant';

// Wiki (minecraft.wiki/w/Froglight#Acquisition): the canonical mapping
// from frog variant to froglight is:
//   Warm      → Pearlescent
//   Temperate → Ochre
//   Cold      → Verdant
// A prior "fix" swapped temperate↔warm based on a guess from frog body
// colors (orange ≈ ochre / white ≈ pearlescent), but that guess was
// backwards: it's the warm frog that produces pearlescent and the
// temperate frog that produces ochre. Sibling frog_eat_entity.ts and
// frog_variant_biome.ts had the same inverted mapping.
export function froglightFor(variant: FrogVariant): FroglightColor {
  if (variant === 'warm') return 'pearlescent';
  if (variant === 'temperate') return 'ochre';
  return 'verdant';
}

export function magmaCubeEaten(size: number): boolean {
  return size === 1;
}

export const FROGLIGHT_LIGHT_LEVEL = 15;
