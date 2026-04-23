export const GLOW_LIGHT_LEVEL = 14;
export const REGULAR_LIGHT_LEVEL = 0;

export function lightLevel(glow: boolean): number {
  return glow ? GLOW_LIGHT_LEVEL : REGULAR_LIGHT_LEVEL;
}

export function illuminatesItemTexture(glow: boolean): boolean {
  return glow;
}

export function brokenByArrowDropsItem(): boolean {
  return true;
}
