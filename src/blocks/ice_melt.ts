export interface MeltCtx {
  lightLevel: number;
  hasSolidAbove: boolean;
  isPackedOrBlueIce: boolean;
}

export const MELT_THRESHOLD = 11;

export function shouldMelt(c: MeltCtx): boolean {
  if (c.isPackedOrBlueIce) return false;
  if (c.hasSolidAbove) return false;
  return c.lightLevel > MELT_THRESHOLD;
}

export function meltsTo(): string {
  return 'water';
}

export function silkTouchPreservesIce(): boolean {
  return true;
}
