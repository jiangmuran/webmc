export interface TempCtx {
  biomeTemp: number;
  y: number;
}

export const SEA_LEVEL = 64;
export const TEMP_DECREASE_PER_BLOCK = 0.00125;

export function adjustedTemp(c: TempCtx): number {
  if (c.y <= SEA_LEVEL) return c.biomeTemp;
  return c.biomeTemp - (c.y - SEA_LEVEL) * TEMP_DECREASE_PER_BLOCK;
}

export function isSnowAt(c: TempCtx): boolean {
  return adjustedTemp(c) < 0.15;
}
