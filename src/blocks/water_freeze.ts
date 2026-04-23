export interface FreezeCtx {
  biomeTemp: number;
  hasSkylight: boolean;
  isWaterSource: boolean;
  nearbySolidCount: number;
}

export const FREEZE_TEMP = 0.15;

export function canFreeze(c: FreezeCtx): boolean {
  if (!c.isWaterSource) return false;
  if (!c.hasSkylight) return false;
  if (c.biomeTemp >= FREEZE_TEMP) return false;
  return c.nearbySolidCount >= 1;
}

export function frozenBlock(): string {
  return 'ice';
}
