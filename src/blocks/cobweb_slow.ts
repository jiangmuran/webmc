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

// Wiki (minecraft.wiki/w/Cobweb): "Shears break a cobweb instantly,
// dropping the cobweb item itself. Swords (and any other valid tool)
// break a cobweb in 0.4 seconds, dropping 1 string." Old function
// had shears drop string — non-vanilla and inconsistent with sibling
// cobweb_physics.ts which already returns the cobweb item for shears.
export function cobwebDrop(
  tool: 'shears' | 'sword' | 'hand',
): 'webmc:string' | 'webmc:cobweb' | null {
  if (tool === 'shears') return 'webmc:cobweb';
  if (tool === 'sword') return 'webmc:string';
  return null;
}
