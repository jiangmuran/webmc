// Frog variant by spawn biome temperature: cold→green, temperate→white,
// warm→orange. Tadpoles mature into frogs taking their parent biome's
// ambient temperature at maturity time, not at spawn time.

export type FrogVariant = 'temperate' | 'warm' | 'cold';

export function frogVariantForTemp(temp: number): FrogVariant {
  if (temp <= 0.15) return 'cold';
  if (temp >= 1.0) return 'warm';
  return 'temperate';
}

export const TADPOLE_MATURE_TICKS = 24000; // 20 min @ 20 Hz

export interface Tadpole {
  ageTicks: number;
}

export function tickTadpole(t: Tadpole): boolean {
  t.ageTicks += 1;
  return t.ageTicks >= TADPOLE_MATURE_TICKS;
}

// Wiki (minecraft.wiki/w/Froglight#Acquisition): only small magma
// cubes produce froglight; the COLOR is determined by the frog's
// variant per the wiki table:
//   Warm      → Pearlescent
//   Temperate → Ochre
//   Cold      → Verdant
//
// 5th sibling froglight-mapping module. A previous "fix" had
// temperate↔warm swapped based on a thematic guess; the wiki table
// reverses that intuition. Siblings frog_eat_entity,
// frog_light_produce, frog_variant_biome, frog_tongue_catch are
// already corrected.
export function froglightFor(
  variant: FrogVariant,
  eaten: 'magma_cube' | 'slime' | 'strider',
): 'webmc:pearlescent_froglight' | 'webmc:ochre_froglight' | 'webmc:verdant_froglight' | null {
  if (eaten !== 'magma_cube') return null;
  if (variant === 'warm') return 'webmc:pearlescent_froglight';
  if (variant === 'temperate') return 'webmc:ochre_froglight';
  return 'webmc:verdant_froglight';
}
