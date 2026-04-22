// Dragon egg. Right-click teleports it to a random spot within 31
// blocks; cannot be mined except via piston push. Ignores gravity.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DragonEggLookup {
  isReplaceable(x: number, y: number, z: number): boolean;
}

const RADIUS = 15;

export function teleportDragonEgg(
  from: Vec3,
  lookup: DragonEggLookup,
  rng: () => number = Math.random,
): Vec3 | null {
  for (let attempt = 0; attempt < 32; attempt++) {
    const dx = Math.floor((rng() - 0.5) * 2 * RADIUS);
    const dy = Math.floor((rng() - 0.5) * 2 * RADIUS);
    const dz = Math.floor((rng() - 0.5) * 2 * RADIUS);
    const t = { x: from.x + dx, y: from.y + dy, z: from.z + dz };
    if (lookup.isReplaceable(t.x, t.y, t.z)) return t;
  }
  return null;
}
