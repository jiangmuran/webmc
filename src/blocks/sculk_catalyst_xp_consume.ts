export interface CatalystCtx {
  mobXp: number;
  distanceToDeath: number;
}

export const MAX_RADIUS = 8;

export function chargeGenerated(c: CatalystCtx): number {
  if (c.distanceToDeath > MAX_RADIUS) return 0;
  return Math.max(0, c.mobXp);
}

export function emitsSoulParticleForXp(c: CatalystCtx): boolean {
  return c.mobXp > 0 && c.distanceToDeath <= MAX_RADIUS;
}
