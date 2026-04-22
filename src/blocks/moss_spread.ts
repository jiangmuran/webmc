// Moss block spreading via bone meal. Turns adjacent dirt / grass / stone
// / cobblestone within a 3-block radius into moss, with some flowers /
// azaleas / moss carpet decoration.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MossLookup {
  isMossReplaceable(x: number, y: number, z: number): boolean;
  hasAirAbove(x: number, y: number, z: number): boolean;
}

export type MossPlacement =
  | { pos: Vec3; block: 'webmc:moss_block' }
  | { pos: Vec3; block: 'webmc:moss_carpet' }
  | { pos: Vec3; block: 'webmc:azalea' }
  | { pos: Vec3; block: 'webmc:flowering_azalea' }
  | { pos: Vec3; block: 'webmc:short_grass' };

export function boneMealMoss(
  origin: Vec3,
  lookup: MossLookup,
  rng: () => number = Math.random,
): readonly MossPlacement[] {
  const placements: MossPlacement[] = [];
  for (let dx = -3; dx <= 3; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -3; dz <= 3; dz++) {
        if (dx * dx + dz * dz > 9) continue;
        const p = { x: origin.x + dx, y: origin.y + dy, z: origin.z + dz };
        if (!lookup.isMossReplaceable(p.x, p.y, p.z)) continue;
        if (rng() > 0.5) continue;
        placements.push({ pos: p, block: 'webmc:moss_block' });
        // Some cells grow decoration on top.
        if (lookup.hasAirAbove(p.x, p.y, p.z) && rng() < 0.4) {
          const r = rng();
          let deco: MossPlacement['block'];
          if (r < 0.25) deco = 'webmc:azalea';
          else if (r < 0.35) deco = 'webmc:flowering_azalea';
          else if (r < 0.65) deco = 'webmc:short_grass';
          else deco = 'webmc:moss_carpet';
          placements.push({ pos: { x: p.x, y: p.y + 1, z: p.z }, block: deco });
        }
      }
    }
  }
  return placements;
}
