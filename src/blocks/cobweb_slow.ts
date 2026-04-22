// Cobweb. Entities move ~5x slower through cobweb; fall damage
// negated; entity can still attack/shoot.

export interface CobwebQuery {
  inCobweb: boolean;
}

export const COBWEB_SPEED_MULT = 0.2;

export function speedMultiplier(q: CobwebQuery): number {
  return q.inCobweb ? COBWEB_SPEED_MULT : 1;
}

export function fallDamageInCobweb(q: CobwebQuery, rawDamage: number): number {
  return q.inCobweb ? 0 : rawDamage;
}

// Cobweb breaks with shears (drops string) or sword (drops string).
export function cobwebDrop(
  tool: 'shears' | 'sword' | 'hand',
): 'webmc:string' | 'webmc:cobweb' | null {
  if (tool === 'shears' || tool === 'sword') return 'webmc:string';
  return null;
}
