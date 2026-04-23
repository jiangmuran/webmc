export interface ConduitCtx {
  prismarineBlockCount: number;
  inWaterOrWaterlogged: boolean;
}

export const MIN_FRAME = 16;
export const POWER_FULL = 42;

export function isActive(c: ConduitCtx): boolean {
  return c.inWaterOrWaterlogged && c.prismarineBlockCount >= MIN_FRAME;
}

export function conduitPowerRange(c: ConduitCtx): number {
  if (!isActive(c)) return 0;
  return Math.floor((c.prismarineBlockCount / POWER_FULL) * 96);
}

export function attacksHostiles(c: ConduitCtx): boolean {
  return c.prismarineBlockCount >= POWER_FULL && c.inWaterOrWaterlogged;
}
