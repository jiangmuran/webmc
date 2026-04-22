// Slab stacking & placement. Single slab occupies top or bottom half.
// Placing a second same-material slab in the same cell turns it into a
// double slab (full block).

export type SlabHalf = 'top' | 'bottom' | 'double';

export interface PlaceQuery {
  existingBlockId: string | null;
  existingHalf: SlabHalf | null;
  newSlabId: string;
  clickedFace: 'top' | 'bottom' | 'side';
  clickedOnUpperHalfOfFace: boolean; // y within block
}

export type PlaceResult =
  | { kind: 'place_single'; id: string; half: SlabHalf }
  | { kind: 'make_double'; id: string }
  | { kind: 'invalid' };

export function placeSlab(q: PlaceQuery): PlaceResult {
  // Combine with existing same-material slab → double
  if (q.existingBlockId === q.newSlabId && q.existingHalf !== null && q.existingHalf !== 'double') {
    return { kind: 'make_double', id: q.newSlabId };
  }
  if (q.existingBlockId !== null && q.existingBlockId !== q.newSlabId) {
    return { kind: 'invalid' };
  }
  let half: SlabHalf;
  if (q.clickedFace === 'top') half = 'bottom';
  else if (q.clickedFace === 'bottom') half = 'top';
  else half = q.clickedOnUpperHalfOfFace ? 'top' : 'bottom';
  return { kind: 'place_single', id: q.newSlabId, half };
}

// Stairs facing/shape: facing follows placer yaw; shape is inner/outer
// corner if adjacent to compatible stairs.
export type StairShape = 'straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right';

export interface StairNeighbors {
  frontIsSameFacing: boolean;
  backIsSameFacing: boolean;
  leftIsSameFacing: boolean;
  rightIsSameFacing: boolean;
}

export function stairShape(n: StairNeighbors): StairShape {
  if (n.frontIsSameFacing) {
    if (n.leftIsSameFacing) return 'outer_left';
    if (n.rightIsSameFacing) return 'outer_right';
  }
  if (n.backIsSameFacing) {
    if (n.leftIsSameFacing) return 'inner_left';
    if (n.rightIsSameFacing) return 'inner_right';
  }
  return 'straight';
}
