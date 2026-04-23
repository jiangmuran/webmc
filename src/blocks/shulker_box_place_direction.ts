export type Dir = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface PlaceCtx {
  clickedFace: Dir;
}

export function placedFacing(c: PlaceCtx): Dir {
  return c.clickedFace;
}

export function openAnimationDir(placed: Dir): Dir {
  return placed;
}

export function preservesContentsOnPick(): boolean {
  return true;
}
