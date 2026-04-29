export type FrogVariant = 'temperate' | 'warm' | 'cold';

export function canEat(mob: string): boolean {
  return mob === 'slime_small' || mob === 'magma_cube_small';
}

// Wiki (minecraft.wiki/w/Froglight): froglight color matches the
// frog variant thematically:
//   temperate (white)  → pearlescent
//   warm     (orange)  → ochre
//   cold     (green)   → verdant
// Old map had temperate↔warm swapped.
export function dropFromFrogEat(mob: string, variant: FrogVariant): string | undefined {
  if (mob !== 'magma_cube_small') return undefined;
  const result: Record<FrogVariant, string> = {
    temperate: 'pearlescent_froglight',
    warm: 'ochre_froglight',
    cold: 'verdant_froglight',
  };
  return result[variant];
}

export function tongueRange(): number {
  return 10;
}
