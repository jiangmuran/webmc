export interface BreakCtx {
  silkTouch: boolean;
  block: string;
}

// Wiki (minecraft.wiki/w/Tinted_Glass): "Tinted glass drops as an
// item when broken with any tool or by hand, unlike other glass."
// (MC-206388 confirms WAI.) Old code returned undefined for tinted
// glass without silk touch, so a tinted-glass farm built without a
// silk-touch tool yielded nothing — wiki canon says it drops self.
export function dropsOnBreak(c: BreakCtx): string | undefined {
  if (c.silkTouch) return c.block;
  if (c.block === 'tinted_glass') return c.block;
  if (c.block.endsWith('_stained_glass') || c.block === 'glass') {
    return undefined;
  }
  return undefined;
}

export function shatters(c: BreakCtx): boolean {
  if (c.block === 'tinted_glass') return false;
  return !c.silkTouch;
}
