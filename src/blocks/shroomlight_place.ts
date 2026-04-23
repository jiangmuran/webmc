export const SHROOMLIGHT_LIGHT_LEVEL = 15;

export function emitsLight(): number {
  return SHROOMLIGHT_LIGHT_LEVEL;
}

export function droppedBySilkTouchOnly(): boolean {
  return true;
}

export function hoeIsPreferredTool(): boolean {
  return true;
}
