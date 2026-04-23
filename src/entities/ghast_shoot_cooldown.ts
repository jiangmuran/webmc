export interface GhastState {
  tickSinceLastShot: number;
  hasTarget: boolean;
}

export const FIREBALL_COOLDOWN_TICKS = 60;

export function canShoot(g: GhastState): boolean {
  return g.hasTarget && g.tickSinceLastShot >= FIREBALL_COOLDOWN_TICKS;
}

export function retreatWhileCharging(g: GhastState): boolean {
  return g.hasTarget && g.tickSinceLastShot < FIREBALL_COOLDOWN_TICKS;
}
