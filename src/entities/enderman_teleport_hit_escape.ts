export interface EndermanCtx {
  tookDamage: boolean;
  inWater: boolean;
  inRain: boolean;
}

export const TELEPORT_RADIUS = 32;

export function shouldTeleport(c: EndermanCtx, rng: () => number): boolean {
  if (c.inWater || c.inRain) return rng() < 0.5;
  if (c.tookDamage) return rng() < 0.15;
  return false;
}

export function pickTeleportOffset(rng: () => number): { dx: number; dy: number; dz: number } {
  return {
    dx: (rng() - 0.5) * TELEPORT_RADIUS * 2,
    dy: Math.floor((rng() - 0.5) * 16),
    dz: (rng() - 0.5) * TELEPORT_RADIUS * 2,
  };
}
