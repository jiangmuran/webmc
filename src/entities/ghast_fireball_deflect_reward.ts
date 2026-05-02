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

// Wiki (minecraft.wiki/w/Ghast#Behavior): "When within range, a ghast
// faces the player and shoots a fireball every 3 seconds" — exactly
// 3 s = 60 ticks, not a 2-3 s random range. Sibling ghast_behavior.ts
// uses 3000 ms; this module keeps the rng signature for caller
// compatibility but returns a flat 60.
export const GHAST_SHOOT_INTERVAL_TICKS = 60;

export function shootInterval(_rng: () => number): number {
  return GHAST_SHOOT_INTERVAL_TICKS;
}
