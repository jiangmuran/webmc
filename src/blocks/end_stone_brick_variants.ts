export type EndStoneFamily =
  | 'end_stone'
  | 'end_stone_bricks'
  | 'end_stone_brick_stairs'
  | 'end_stone_brick_slab'
  | 'end_stone_brick_wall';

export function craftingYield(family: EndStoneFamily): number {
  switch (family) {
    case 'end_stone_bricks':
      return 4;
    case 'end_stone_brick_stairs':
      return 4;
    case 'end_stone_brick_slab':
      return 6;
    case 'end_stone_brick_wall':
      return 6;
    default:
      return 1;
  }
}

// Wiki (minecraft.wiki/w/End_Stone, /w/Stonecutter): end stone can
// be stonecut directly to end stone bricks, end stone brick stairs,
// end stone brick slabs, OR end stone brick walls — i.e. any brick
// variant in one step. Old code restricted from=end_stone to only
// end_stone_bricks, requiring a needless intermediate cut for
// stairs/slab/wall (and using twice as much input via the crafting-
// table recipes).
export function stonecutterProduces(from: EndStoneFamily, to: EndStoneFamily): boolean {
  if (from === to) return false;
  if (from === 'end_stone') return to !== 'end_stone';
  if (from === 'end_stone_bricks') return to !== 'end_stone';
  return false;
}
