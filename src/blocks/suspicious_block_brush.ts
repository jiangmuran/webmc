export interface BrushCtx {
  brushingTicks: number;
  hitBlock: string;
  hasBrush: boolean;
}

export const BRUSH_TOTAL_TICKS = 10;

export const BRUSHABLE = new Set(['suspicious_sand', 'suspicious_gravel']);

export function canBrush(c: BrushCtx): boolean {
  return c.hasBrush && BRUSHABLE.has(c.hitBlock);
}

export function progressFraction(c: BrushCtx): number {
  return Math.min(1, c.brushingTicks / BRUSH_TOTAL_TICKS);
}

export function completesThisTick(c: BrushCtx): boolean {
  return canBrush(c) && c.brushingTicks >= BRUSH_TOTAL_TICKS;
}
