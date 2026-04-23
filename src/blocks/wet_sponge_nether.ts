export type Dim = 'overworld' | 'nether' | 'end';

export interface DryCtx {
  dim: Dim;
  inFurnace: boolean;
}

export function driesInstantly(c: DryCtx): boolean {
  return c.dim === 'nether';
}

export function smeltsToDry(c: DryCtx): boolean {
  return c.inFurnace;
}

export function emitsSteamParticles(c: DryCtx): boolean {
  return c.dim === 'nether';
}
