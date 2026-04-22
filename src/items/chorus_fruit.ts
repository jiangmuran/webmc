// Chorus fruit. Eating (or throwing onto the ground) teleports the player
// to a random free block within ±8 blocks on each axis. Restores 4 hunger
// + 2.4 saturation.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ChorusLookup {
  isPassable(x: number, y: number, z: number): boolean;
  hasSupport(x: number, y: number, z: number): boolean; // solid below
}

const MAX_RADIUS = 8;

export function chorusFruitTeleport(
  from: Vec3,
  lookup: ChorusLookup,
  rng: () => number = Math.random,
): Vec3 | null {
  for (let attempt = 0; attempt < 16; attempt++) {
    const dx = Math.floor((rng() - 0.5) * 2 * MAX_RADIUS);
    const dy = Math.floor((rng() - 0.5) * 2 * MAX_RADIUS);
    const dz = Math.floor((rng() - 0.5) * 2 * MAX_RADIUS);
    const target = { x: from.x + dx, y: from.y + dy, z: from.z + dz };
    if (
      lookup.isPassable(target.x, target.y, target.z) &&
      lookup.isPassable(target.x, target.y + 1, target.z) &&
      lookup.hasSupport(target.x, target.y - 1, target.z)
    ) {
      return target;
    }
  }
  return null;
}

export const CHORUS_HUNGER_RESTORE = 4;
export const CHORUS_SATURATION = 2.4;
