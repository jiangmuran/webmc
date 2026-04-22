// Ender crystals bind a healing beam to the Ender Dragon within range.
// Beam appears while both crystal and dragon are alive and in range.

export interface BeamQuery {
  crystalAlive: boolean;
  dragonAlive: boolean;
  distance: number;
}

export const CRYSTAL_BEAM_RANGE = 32;
export const CRYSTAL_HEAL_PER_TICK = 1;

export function beamActive(q: BeamQuery): boolean {
  if (!q.crystalAlive || !q.dragonAlive) return false;
  return q.distance <= CRYSTAL_BEAM_RANGE;
}

export function healThisTick(q: BeamQuery): number {
  return beamActive(q) ? CRYSTAL_HEAL_PER_TICK : 0;
}

// Destroying a crystal explodes it (radius 6) and removes the beam link.
export const CRYSTAL_EXPLOSION_RADIUS = 6;

export function onCrystalDestroyed(): { explosionRadius: number; beamRemoved: boolean } {
  return { explosionRadius: CRYSTAL_EXPLOSION_RADIUS, beamRemoved: true };
}
