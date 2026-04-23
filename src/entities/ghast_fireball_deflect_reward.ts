export interface FireballHit {
  victimIsGhast: boolean;
  deflectedByPlayer: boolean;
  deflectedBySword: boolean;
}

export function grantsAdvancement(h: FireballHit): boolean {
  return h.victimIsGhast && h.deflectedByPlayer;
}

export function returnsToOriginDirection(deflected: boolean): boolean {
  return deflected;
}

export const GHAST_SHOOT_INTERVAL_MIN = 40;
export const GHAST_SHOOT_INTERVAL_MAX = 60;

export function shootInterval(rng: () => number): number {
  return (
    GHAST_SHOOT_INTERVAL_MIN +
    Math.floor(rng() * (GHAST_SHOOT_INTERVAL_MAX - GHAST_SHOOT_INTERVAL_MIN))
  );
}
