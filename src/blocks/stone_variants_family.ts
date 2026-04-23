// Stone family variants: stone, smooth, cobble, mossy, stonecutter
// recipes + stair/slab/wall derivatives.

export type StoneVariant =
  | 'stone'
  | 'smooth_stone'
  | 'cobblestone'
  | 'mossy_cobblestone'
  | 'stone_bricks'
  | 'cracked_stone_bricks'
  | 'mossy_stone_bricks'
  | 'chiseled_stone_bricks'
  | 'granite'
  | 'polished_granite'
  | 'andesite'
  | 'polished_andesite'
  | 'diorite'
  | 'polished_diorite';

const SMELT_MAP: Record<string, StoneVariant> = {
  cobblestone: 'stone',
  stone: 'smooth_stone',
  stone_bricks: 'cracked_stone_bricks',
};

export function smeltInto(block: string): StoneVariant | null {
  return SMELT_MAP[block] ?? null;
}

const POLISH_MAP: Record<string, StoneVariant> = {
  granite: 'polished_granite',
  andesite: 'polished_andesite',
  diorite: 'polished_diorite',
};

export function polishedOf(stone: string): StoneVariant | null {
  return POLISH_MAP[stone] ?? null;
}

export function isCobblestone(v: string): boolean {
  return v === 'cobblestone' || v === 'mossy_cobblestone';
}
