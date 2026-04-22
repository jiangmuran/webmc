// Spawn-point safety + world-spawn search. When a world is created, the
// engine searches a ring around (0, 0) for a safe 3×3 patch of grass/sand
// with clear sky above. When a player respawns without a bed, they
// respawn within a 20-block radius of the world spawn.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SpawnLookup {
  topSolidY: (x: number, z: number) => number | null;
  blockAt: (x: number, y: number, z: number) => string;
  isOpaque: (x: number, y: number, z: number) => boolean;
}

const SAFE_TOP_BLOCKS = new Set([
  'webmc:grass_block',
  'webmc:sand',
  'webmc:dirt',
  'webmc:coarse_dirt',
  'webmc:podzol',
  'webmc:stone',
  'webmc:cobblestone',
]);

export interface SpawnSafetyQuery {
  center: { x: number; z: number };
  lookup: SpawnLookup;
  radius: number;
}

export function findWorldSpawn(q: SpawnSafetyQuery): Vec3 | null {
  for (let r = 0; r <= q.radius; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) !== r && Math.abs(dz) !== r && r > 0) continue;
        const cx = q.center.x + dx;
        const cz = q.center.z + dz;
        const y = q.lookup.topSolidY(cx, cz);
        if (y === null) continue;
        if (!SAFE_TOP_BLOCKS.has(q.lookup.blockAt(cx, y, cz))) continue;
        if (q.lookup.isOpaque(cx, y + 1, cz)) continue;
        if (q.lookup.isOpaque(cx, y + 2, cz)) continue;
        return { x: cx + 0.5, y: y + 1, z: cz + 0.5 };
      }
    }
  }
  return null;
}

// Bedless-respawn jitter: pick a point within `radius` of worldSpawn that
// passes the same safety check. Falls back to world spawn if none found.
export function bedlessRespawn(
  worldSpawn: Vec3,
  lookup: SpawnLookup,
  rng: () => number,
  radius = 20,
): Vec3 {
  for (let tries = 0; tries < 10; tries++) {
    const angle = rng() * Math.PI * 2;
    const dist = rng() * radius;
    const cx = Math.floor(worldSpawn.x + Math.cos(angle) * dist);
    const cz = Math.floor(worldSpawn.z + Math.sin(angle) * dist);
    const y = lookup.topSolidY(cx, cz);
    if (y === null) continue;
    if (!SAFE_TOP_BLOCKS.has(lookup.blockAt(cx, y, cz))) continue;
    if (lookup.isOpaque(cx, y + 1, cz)) continue;
    if (lookup.isOpaque(cx, y + 2, cz)) continue;
    return { x: cx + 0.5, y: y + 1, z: cz + 0.5 };
  }
  return { ...worldSpawn };
}
