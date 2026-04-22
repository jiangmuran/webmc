// Tuff variants (1.21): tuff bricks, polished tuff, chiseled tuff, plus
// slabs/stairs/walls. All are decorative, pickaxe-mined.

export type TuffVariant =
  | 'tuff'
  | 'polished_tuff'
  | 'tuff_bricks'
  | 'chiseled_tuff'
  | 'chiseled_tuff_bricks'
  | 'tuff_slab'
  | 'polished_tuff_slab'
  | 'tuff_brick_slab'
  | 'tuff_stairs'
  | 'polished_tuff_stairs'
  | 'tuff_brick_stairs'
  | 'tuff_wall'
  | 'polished_tuff_wall'
  | 'tuff_brick_wall';

export function isTuff(id: string): boolean {
  return id === 'tuff' || id.startsWith('polished_tuff') || id.startsWith('tuff_');
}

export const TUFF_HARDNESS = 1.5;
export const TUFF_BLAST_RESISTANCE = 6;

export function stonecutterRecipe(input: TuffVariant, output: TuffVariant): boolean {
  // All tuff variants cut from plain tuff, tuff bricks, or polished tuff.
  const sources = new Set<TuffVariant>(['tuff', 'tuff_bricks', 'polished_tuff']);
  if (!sources.has(input)) return false;
  return input !== output;
}
