export interface FrostCtx {
  level: number;
  belowBlock: string;
  blockIsWaterSource: boolean;
}

export const RADIUS_BASE = 2;

export function radius(level: number): number {
  return RADIUS_BASE + Math.max(0, level);
}

export function freezesBlock(c: FrostCtx): boolean {
  if (c.level <= 0) return false;
  return c.blockIsWaterSource;
}

export function resultingBlock(c: FrostCtx): string | undefined {
  return freezesBlock(c) ? 'frosted_ice' : undefined;
}
