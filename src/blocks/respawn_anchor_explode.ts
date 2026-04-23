export type Dim = 'overworld' | 'nether' | 'end';

export interface UseContext {
  dim: Dim;
  charges: number;
  playerTryingToSleep: boolean;
}

export const EXPLOSION_RADIUS = 5;

export function explodesOnUse(c: UseContext): boolean {
  if (c.dim === 'nether') return false;
  return c.playerTryingToSleep && c.charges > 0;
}

export function chargeCost(): number {
  return 1;
}
