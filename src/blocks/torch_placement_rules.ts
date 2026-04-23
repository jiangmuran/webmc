export type Face = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface PlaceCtx {
  clickedFace: Face;
  backingSolid: boolean;
  isSoulTorch: boolean;
}

export function canPlace(c: PlaceCtx): boolean {
  if (c.clickedFace === 'down') return false;
  return c.backingSolid;
}

export function placedOrientation(c: PlaceCtx): 'floor' | `wall_${Exclude<Face, 'up' | 'down'>}` {
  if (c.clickedFace === 'up') return 'floor';
  return `wall_${c.clickedFace as Exclude<Face, 'up' | 'down'>}`;
}

export function lightLevel(c: PlaceCtx): number {
  return c.isSoulTorch ? 10 : 14;
}
