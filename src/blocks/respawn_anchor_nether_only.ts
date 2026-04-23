export type Dimension = 'overworld' | 'nether' | 'end';

export interface RespawnAnchor {
  charges: number;
}

export const MAX_CHARGES = 4;

export function canRespawnAt(a: RespawnAnchor, dimension: Dimension): boolean {
  if (dimension !== 'nether') return false;
  return a.charges > 0;
}

export function consumeCharge(a: RespawnAnchor): RespawnAnchor {
  return { charges: Math.max(0, a.charges - 1) };
}

export function charge(a: RespawnAnchor): RespawnAnchor {
  return { charges: Math.min(MAX_CHARGES, a.charges + 1) };
}

export function explodesOnUse(a: RespawnAnchor, dimension: Dimension): boolean {
  return dimension !== 'nether' && a.charges > 0;
}
