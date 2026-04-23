export interface PlaceCtx {
  clickedBottomFace: boolean;
  hasSolidAbove: boolean;
  hasSolidBelow: boolean;
}

export type HangState = 'hanging' | 'standing';

export const LANTERN_LIGHT = 15;
export const SOUL_LANTERN_LIGHT = 10;

export function hangStateOnPlace(c: PlaceCtx): HangState | 'fail' {
  if (c.clickedBottomFace && c.hasSolidAbove) return 'hanging';
  if (c.hasSolidBelow) return 'standing';
  return 'fail';
}

export function lightOf(soul: boolean): number {
  return soul ? SOUL_LANTERN_LIGHT : LANTERN_LIGHT;
}
