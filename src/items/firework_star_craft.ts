// Firework star. Gunpowder + dye + optional shape modifier (feather,
// fire charge, gold nugget, skull, head).

export type StarShape = 'small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst';

export function shapeFromModifier(mod: string | null): StarShape {
  if (mod === 'fire_charge') return 'large_ball';
  if (mod === 'gold_nugget') return 'star';
  if (mod === 'head') return 'creeper';
  if (mod === 'feather') return 'burst';
  return 'small_ball';
}

export interface StarRecipe {
  gunpowder: number;
  dye: number;
  modifier: string | null;
  trail: boolean;
  twinkle: boolean;
}

export function canCraft(r: StarRecipe): boolean {
  return r.gunpowder >= 1 && r.dye >= 1;
}

export function modifierEffect(r: StarRecipe): { trail: boolean; twinkle: boolean } {
  return { trail: r.trail, twinkle: r.twinkle };
}
