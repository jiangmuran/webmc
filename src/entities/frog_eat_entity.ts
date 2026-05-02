export type FrogVariant = 'temperate' | 'warm' | 'cold';

export function canEat(mob: string): boolean {
  return mob === 'slime_small' || mob === 'magma_cube_small';
}

// Wiki (minecraft.wiki/w/Froglight): the wiki's frog→froglight table
// is unambiguous:
//   Warm      → Pearlescent
//   Temperate → Ochre
//   Cold      → Verdant
// A previous "fix" swapped temperate↔warm based on a guess from frog
// colors (white/orange) and got the swap backwards: warm produces the
// pearlescent (white-ish) light, NOT temperate. Re-checking the
// Froglight wiki page #Acquisition table verifies the wiki canon.
// Sibling frog_light_produce.ts and frog_variant_biome.ts had the
// same inverted mapping; all three now agree with wiki.
export function dropFromFrogEat(mob: string, variant: FrogVariant): string | undefined {
  if (mob !== 'magma_cube_small') return undefined;
  const result: Record<FrogVariant, string> = {
    warm: 'pearlescent_froglight',
    temperate: 'ochre_froglight',
    cold: 'verdant_froglight',
  };
  return result[variant];
}

export function tongueRange(): number {
  return 10;
}
