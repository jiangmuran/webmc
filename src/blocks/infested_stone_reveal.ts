export interface InfestBreakCtx {
  block: string;
  hasSilkTouch: boolean;
  powerLevel: number;
}

export function silverfishSpawns(c: InfestBreakCtx): boolean {
  if (!c.block.startsWith('infested_')) return false;
  return !c.hasSilkTouch;
}

export function dropsBlockItem(c: InfestBreakCtx): string | undefined {
  if (!c.block.startsWith('infested_')) return undefined;
  return c.hasSilkTouch ? c.block : undefined;
}

export function tntExplosionSpawnsExtra(c: InfestBreakCtx): boolean {
  return c.block.startsWith('infested_') && c.powerLevel >= 4;
}
