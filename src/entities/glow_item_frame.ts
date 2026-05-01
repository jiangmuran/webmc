// Glow item frame. Wiki (minecraft.wiki/w/Glow_Item_Frame): "Light: 0
// — the glow item frame's contents are rendered with full brightness,
// but the frame itself does not emit any block light."
//
// Old GLOW_LIGHT_LEVEL = 14 + lightLevel(true) → 14 falsely reported
// glow frames as a light source — placing them next to crops would
// have falsely satisfied the crop-grow light threshold, and mob-spawn
// checks would think the area was lit. Visual fullbright on the
// displayed item is unrelated to block-light emission and is exposed
// separately via `illuminatesItemTexture`.
export const GLOW_LIGHT_LEVEL = 0;
export const REGULAR_LIGHT_LEVEL = 0;

export function lightLevel(_glow: boolean): number {
  return 0;
}

export function illuminatesItemTexture(glow: boolean): boolean {
  return glow;
}

export function brokenByArrowDropsItem(): boolean {
  return true;
}
