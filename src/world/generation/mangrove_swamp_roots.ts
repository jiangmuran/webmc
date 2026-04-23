export interface RootCtx {
  isMangroveBiome: boolean;
  aboveY: number;
  isMud: boolean;
}

export const MAX_ROOT_Y = 64;

export function placesPropagule(c: RootCtx, rng: () => number): boolean {
  return c.isMangroveBiome && rng() < 0.05;
}

export function rootsBelowWaterOK(c: RootCtx): boolean {
  return c.isMangroveBiome && c.aboveY <= MAX_ROOT_Y;
}

export function mudIsGroundCover(c: RootCtx): boolean {
  return c.isMangroveBiome && c.isMud;
}
