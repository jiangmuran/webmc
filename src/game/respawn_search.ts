// Safe respawn location search. Given a desired spawn point (bed or
// charged respawn anchor), scans outward for an air-air-solid column
// where the player can stand without suffocating or taking fall damage.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface RespawnLookup {
  isAir: (x: number, y: number, z: number) => boolean;
  isSolid: (x: number, y: number, z: number) => boolean;
  // For safety: returns true for lava, fire, cactus, void etc.
  isDangerous: (x: number, y: number, z: number) => boolean;
}

export interface RespawnQuery {
  anchor: Vec3;
  lookup: RespawnLookup;
  searchRadius: number;
}

export function findRespawnPoint(q: RespawnQuery): Vec3 | null {
  const { anchor, lookup } = q;
  // Try the anchor first.
  if (isSafeStand(anchor, lookup)) return anchor;
  // Spiral outward in X/Z, at each ring scanning Y ±4.
  for (let r = 1; r <= q.searchRadius; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
        for (let dy = -4; dy <= 4; dy++) {
          const pos = {
            x: anchor.x + dx,
            y: anchor.y + dy,
            z: anchor.z + dz,
          };
          if (isSafeStand(pos, lookup)) return pos;
        }
      }
    }
  }
  return null;
}

// A position is "safe to stand at" if the block below is solid, the
// player's 2-block head/body cavity is air, and none of the 5 immediately
// touching blocks are dangerous.
export function isSafeStand(pos: Vec3, lookup: RespawnLookup): boolean {
  if (!lookup.isSolid(pos.x, pos.y - 1, pos.z)) return false;
  if (!lookup.isAir(pos.x, pos.y, pos.z)) return false;
  if (!lookup.isAir(pos.x, pos.y + 1, pos.z)) return false;
  if (lookup.isDangerous(pos.x, pos.y - 1, pos.z)) return false;
  if (lookup.isDangerous(pos.x, pos.y, pos.z)) return false;
  if (lookup.isDangerous(pos.x, pos.y + 1, pos.z)) return false;
  return true;
}
