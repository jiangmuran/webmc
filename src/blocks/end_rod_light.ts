// End rod: decorative light source, light level 14. Can be placed in
// any direction (6 orientations). Waterloggable.

export interface EndRod {
  axis: '+x' | '-x' | '+y' | '-y' | '+z' | '-z';
  waterlogged: boolean;
}

export const END_ROD_LIGHT = 14;

export function lightLevel(): number {
  return END_ROD_LIGHT;
}

export function pickAxisFromClick(
  clickedFaceNormal: '+x' | '-x' | '+y' | '-y' | '+z' | '-z',
): EndRod['axis'] {
  return clickedFaceNormal;
}

export function canWaterlog(): boolean {
  return true;
}

export function renderHeightBlocks(): number {
  return 1; // 16/16
}
