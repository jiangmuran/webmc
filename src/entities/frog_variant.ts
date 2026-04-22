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

// Frog eats small slimes / magma cubes; magma cube → pearlescent
// froglight, small slime → ochre, striders → verdant.
export function froglightFor(
  variant: FrogVariant,
  eaten: 'magma_cube' | 'slime' | 'strider',
): 'webmc:pearlescent_froglight' | 'webmc:ochre_froglight' | 'webmc:verdant_froglight' {
  void variant;
  switch (eaten) {
    case 'magma_cube':
      return 'webmc:pearlescent_froglight';
    case 'slime':
      return 'webmc:ochre_froglight';
    case 'strider':
      return 'webmc:verdant_froglight';
  }
}
