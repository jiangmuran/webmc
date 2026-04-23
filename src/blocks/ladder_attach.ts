export type Face = 'north' | 'south' | 'east' | 'west';

export interface Ctx {
  attachFace: Face;
  backingSolid: boolean;
}

export function canPlace(c: Ctx): boolean {
  return c.backingSolid;
}

export function climbable(): boolean {
  return true;
}

export function breaksWhenBackingBroken(c: Ctx): boolean {
  return !c.backingSolid;
}
