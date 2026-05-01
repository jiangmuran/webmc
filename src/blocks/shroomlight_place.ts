export const SHROOMLIGHT_LIGHT_LEVEL = 15;

export function emitsLight(): number {
  return SHROOMLIGHT_LIGHT_LEVEL;
}

// Wiki (minecraft.wiki/w/Shroomlight): "Shroomlight blocks can be
// broken with any tool, and always drop as an item, but a hoe is
// the fastest." Old `droppedBySilkTouchOnly() === true` was a
// silk-touch-only restriction that wiki canon explicitly does NOT
// impose — players in the Nether without silk touch were silently
// losing shroomlights mined off huge fungi.
export function droppedBySilkTouchOnly(): boolean {
  return false;
}

export function hoeIsPreferredTool(): boolean {
  return true;
}
