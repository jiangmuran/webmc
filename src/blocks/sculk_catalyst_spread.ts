export interface SpreadParams {
  mobXpDrop: number;
  nearbyBlocksAvailable: number;
}

export const CHARGE_PER_XP = 1;
export const MAX_SPREAD_RADIUS = 8;

export function chargeFromKill(xp: number): number {
  return Math.max(0, Math.floor(xp)) * CHARGE_PER_XP;
}

export function sculkBlocksPlaced(p: SpreadParams): number {
  const charge = chargeFromKill(p.mobXpDrop);
  return Math.min(charge, Math.max(0, p.nearbyBlocksAvailable));
}

export function emitsSoulSpawnParticle(xp: number): boolean {
  return xp > 0;
}
