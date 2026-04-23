export type Dim = 'overworld' | 'nether' | 'end';

export interface UseCtx {
  dim: Dim;
  targetBlock: string;
  isAir: boolean;
}

export function placesWater(c: UseCtx): boolean {
  if (c.dim === 'nether') return false;
  return c.isAir || c.targetBlock === 'waterloggable';
}

export function evaporatesInNether(c: UseCtx): boolean {
  return c.dim === 'nether';
}

export function returnsEmptyBucket(): boolean {
  return true;
}
