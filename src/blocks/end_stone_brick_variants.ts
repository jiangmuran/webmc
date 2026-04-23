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

export function stonecutterProduces(from: EndStoneFamily, to: EndStoneFamily): boolean {
  if (from === 'end_stone') return to === 'end_stone_bricks';
  if (from === 'end_stone_bricks') return to !== 'end_stone';
  return false;
}
