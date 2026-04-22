// Pale oak tree in the pale garden biome. Tall trunk with canopy;
// hanging moss analog ("pale moss"); creaking hearts spawn creakings.

export interface PaleOakGrowth {
  hasSaplingSpace: boolean;
  lightLevel: number;
  randomTicksSinceBonemeal: number;
}

export const PALE_OAK_MIN_LIGHT = 9;
export const PALE_OAK_TRUNK_MIN = 6;
export const PALE_OAK_TRUNK_MAX = 13;

export function canGrow(g: PaleOakGrowth): boolean {
  if (!g.hasSaplingSpace) return false;
  if (g.lightLevel < PALE_OAK_MIN_LIGHT) return false;
  return true;
}

export function trunkHeight(rand: () => number): number {
  const r = rand();
  return PALE_OAK_TRUNK_MIN + Math.floor(r * (PALE_OAK_TRUNK_MAX - PALE_OAK_TRUNK_MIN + 1));
}

export function heartsPerTree(trunkHeight: number): number {
  // 1 heart per 4 trunk blocks, rounded down, minimum 1.
  return Math.max(1, Math.floor(trunkHeight / 4));
}
