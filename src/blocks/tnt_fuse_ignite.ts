export const DEFAULT_FUSE_TICKS = 80;

export interface TntCtx {
  ignitedByRedstone: boolean;
  ignitedByFlint: boolean;
  ignitedByFire: boolean;
  hitByArrow: boolean;
}

export function isPrimed(c: TntCtx): boolean {
  return c.ignitedByRedstone || c.ignitedByFlint || c.ignitedByFire || c.hitByArrow;
}

export function fuseTicksFor(c: TntCtx): number {
  return isPrimed(c) ? DEFAULT_FUSE_TICKS : 0;
}

export function dropsAsItemIfBroken(c: TntCtx): boolean {
  return !isPrimed(c);
}
