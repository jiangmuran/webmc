export interface BreakCtx {
  silkTouch: boolean;
  block: string;
}

export function dropsOnBreak(c: BreakCtx): string | undefined {
  if (c.silkTouch) return c.block;
  if (c.block.endsWith('_stained_glass') || c.block === 'glass' || c.block === 'tinted_glass') {
    return undefined;
  }
  return undefined;
}

export function shatters(c: BreakCtx): boolean {
  return !c.silkTouch;
}
