export type SlabState = 'bottom' | 'top' | 'double';

export interface PlaceCtx {
  existing?: SlabState;
  clickedAt: 'top' | 'bottom';
  sameSlabType: boolean;
}

export function placedState(c: PlaceCtx): SlabState {
  if (c.existing && c.sameSlabType) return 'double';
  return c.clickedAt === 'top' ? 'bottom' : 'top';
}

export function isDouble(s: SlabState): boolean {
  return s === 'double';
}

export function breaksToDropsBothHalves(s: SlabState): number {
  return s === 'double' ? 2 : 1;
}
