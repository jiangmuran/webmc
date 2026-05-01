// Ender crystals bind a healing beam to the Ender Dragon within
// range. Beam appears while both crystal and dragon are alive and in
// range.
//
// Wiki (minecraft.wiki/w/End_Crystal): "Each end crystal heals the
// dragon at a rate of 1 HP per second when both are present and the
// dragon is within 32 blocks." 1 HP/s = 1/20 HP per game tick. Old
// CRYSTAL_HEAL_PER_TICK = 1 was 20× too aggressive — the dragon
// regenerated 20 HP/s per nearby crystal, making the boss fight
// effectively unwinnable until every crystal was popped.

export interface BeamQuery {
  crystalAlive: boolean;
  dragonAlive: boolean;
  distance: number;
}

export const CRYSTAL_BEAM_RANGE = 32;
// 1 HP/sec = 0.05 HP per game tick. Callers accumulating across
// multiple ticks should sum the fractional amount and apply integer
// heals once the accumulator crosses 1.
export const CRYSTAL_HEAL_PER_TICK = 1 / 20;
export const CRYSTAL_HEAL_PER_SECOND = 1;

export function beamActive(q: BeamQuery): boolean {
  if (!q.crystalAlive || !q.dragonAlive) return false;
  return q.distance <= CRYSTAL_BEAM_RANGE;
}

export function healThisTick(q: BeamQuery): number {
  return beamActive(q) ? CRYSTAL_HEAL_PER_TICK : 0;
}

// Wiki (minecraft.wiki/w/End_Crystal): "When destroyed, the resulting
// explosion has a power of 6, the same as a charged creeper." (Note:
// NOT a TNT-equivalent — TNT is power 4.) The original symbol was
// named CRYSTAL_EXPLOSION_RADIUS but the value is actually the
// explosion *power* (radius is power-derived); kept under both names
// for back-compat.
export const CRYSTAL_EXPLOSION_POWER = 6;
export const CRYSTAL_EXPLOSION_RADIUS = CRYSTAL_EXPLOSION_POWER;

export function onCrystalDestroyed(): { explosionRadius: number; beamRemoved: boolean } {
  return { explosionRadius: CRYSTAL_EXPLOSION_RADIUS, beamRemoved: true };
}
