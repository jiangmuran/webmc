export type FrogVariant = 'temperate' | 'warm' | 'cold';

export function canEat(mob: string): boolean {
  return mob === 'slime_small' || mob === 'magma_cube_small';
}

export function dropFromFrogEat(mob: string, variant: FrogVariant): string | undefined {
  if (mob !== 'magma_cube_small') return undefined;
  const result: Record<FrogVariant, string> = {
    temperate: 'ochre_froglight',
    warm: 'pearlescent_froglight',
    cold: 'verdant_froglight',
  };
  return result[variant];
}

export function tongueRange(): number {
  return 10;
}
