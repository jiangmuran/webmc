// Dragon egg. Right-click teleports it to a random spot in a
// 31×15×31 volume; cannot be mined except via piston push or onto
// a non-full block. Ignores gravity.
//
// Wiki (minecraft.wiki/w/Dragon_Egg): "trying to [mine the dragon
// egg] causes it to teleport within a 31×15×31 volume centered on
// the egg, with locations toward the center more likely. If all air
// blocks in that area are filled so there is nowhere for the egg to
// teleport to, or if it fails to find an air block after 1,000
// attempts at teleporting, it can be mined."
//
// Old code used RADIUS = 15 on ALL axes (giving a 31×31×31 box
// instead of wiki's 31×15×31) and only 32 attempts (vs wiki's 1000),
// making the egg far harder to "lock down" by filling the legitimate
// teleport space.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DragonEggLookup {
  isReplaceable(x: number, y: number, z: number): boolean;
}

const RADIUS_HORIZONTAL = 15;
const RADIUS_VERTICAL = 7;
const MAX_ATTEMPTS = 1000;

// rand offset returning `[-radius, +radius]` inclusive, uniform.
// 2*radius + 1 distinct values.
function offset(radius: number, rng: () => number): number {
  return Math.floor(rng() * (2 * radius + 1)) - radius;
}

export function teleportDragonEgg(
  from: Vec3,
  lookup: DragonEggLookup,
  rng: () => number = Math.random,
): Vec3 | null {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const dx = offset(RADIUS_HORIZONTAL, rng);
    const dy = offset(RADIUS_VERTICAL, rng);
    const dz = offset(RADIUS_HORIZONTAL, rng);
    const t = { x: from.x + dx, y: from.y + dy, z: from.z + dz };
    if (lookup.isReplaceable(t.x, t.y, t.z)) return t;
  }
  return null;
}
