export type Type = 'single' | 'left' | 'right';

export interface PlaceCtx {
  facing: 'n' | 's' | 'e' | 'w';
  adjacentChestFacing?: 'n' | 's' | 'e' | 'w';
  adjacentSide?: 'left' | 'right';
}

export function typeOnPlace(c: PlaceCtx): Type {
  if (!c.adjacentChestFacing || c.adjacentChestFacing !== c.facing || !c.adjacentSide) {
    return 'single';
  }
  return c.adjacentSide === 'left' ? 'right' : 'left';
}

export function mergedCapacity(t: Type): number {
  return t === 'single' ? 27 : 54;
}
