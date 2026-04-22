// Concrete powder. 16 color variants; falls like sand. When adjacent to
// any water source or flowing water, it instantly solidifies into
// concrete (same color).

export type ConcreteColor =
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black';

export interface ConcretePowderQuery {
  color: ConcreteColor;
  touchingWater: boolean;
}

export interface SolidifyResult {
  solidified: boolean;
  newBlock: string | null;
}

export function solidify(q: ConcretePowderQuery): SolidifyResult {
  if (!q.touchingWater) return { solidified: false, newBlock: null };
  return {
    solidified: true,
    newBlock: `webmc:${q.color}_concrete`,
  };
}

// Falling concrete powder: if it falls onto water it turns into solid
// concrete mid-fall at the first water contact.
export interface FallingPowder {
  color: ConcreteColor;
  fallDistanceBlocks: number;
  landedOnWater: boolean;
}

export function onFallLand(p: FallingPowder): string {
  if (p.landedOnWater) return `webmc:${p.color}_concrete`;
  return `webmc:${p.color}_concrete_powder`;
}

// Crafting: 4 sand + 4 gravel + 1 dye = 8 concrete powder of that color.
export interface CraftConcretePowderQuery {
  sand: number;
  gravel: number;
  dye: ConcreteColor | null;
}

export function craftConcretePowder(
  q: CraftConcretePowderQuery,
): { item: string; count: 8 } | null {
  if (q.sand < 4 || q.gravel < 4 || q.dye === null) return null;
  return { item: `webmc:${q.dye}_concrete_powder`, count: 8 };
}
