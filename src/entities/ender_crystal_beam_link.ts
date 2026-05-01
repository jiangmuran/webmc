// Ender crystals bind a healing beam to the Ender Dragon within
// range. Beam appears while both crystal and dragon are alive and in
// range.
//
// Wiki (minecraft.wiki/w/End_Crystal#Healing_the_ender_dragon): "The
// dragon is healed 1 HP each half-second" from the nearest active
// crystal within a 32-block cuboid. The healing is single-source
// (only the nearest crystal contributes — multiple crystals don't
// stack).
//
// 1 HP per half-second = 1 HP per 10 ticks = 0.1 HP per tick.
// Old CRYSTAL_HEAL_PER_TICK = 1 was 10× too aggressive — the dragon
// regenerated 20 HP/s per visible crystal, making the boss fight
// effectively unwinnable. Callers accumulating across multiple
// ticks should sum the fractional amount and apply integer heals
// once the accumulator crosses 1.

export interface BeamQuery {
  crystalAlive: boolean;
  dragonAlive: boolean;
  distance: number;
}

export const CRYSTAL_BEAM_RANGE = 32;
// Wiki: 1 HP per 0.5s = 2 HP/sec = 0.1 HP/tick.
export const CRYSTAL_HEAL_PER_TICK = 0.1;
export const CRYSTAL_HEAL_PER_SECOND = 2;

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
