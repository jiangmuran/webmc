// End outer islands. Far beyond the central end island, scattered
// hollow "end island" clusters of end stone + chorus plants + occasional
// end cities. Island distribution is radial from origin, starting at
// distance 1000.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EndIslandLayout {
  center: Vec3;
  horizontalRadius: number;
  verticalRadius: number;
  chorusSeedCount: number;
  hasEndCity: boolean;
}

export interface EndIslandQuery {
  center: Vec3;
  rng: () => number;
}

export function planEndIsland(q: EndIslandQuery): EndIslandLayout {
  const hr = 16 + Math.floor(q.rng() * 25);
  const vr = 2 + Math.floor(q.rng() * 3);
  return {
    center: { ...q.center },
    horizontalRadius: hr,
    verticalRadius: vr,
    chorusSeedCount: 2 + Math.floor(q.rng() * 6),
    hasEndCity: q.rng() < 0.15,
  };
}

// Islands spawn in a ring 1000+ blocks from origin. Minimum distance to
// the central end island is MIN_ISLAND_DISTANCE.
export const MIN_ISLAND_DISTANCE = 1000;
export const OUTER_END_START_DISTANCE = 1000;

export function isOuterEnd(pos: Vec3): boolean {
  return Math.hypot(pos.x, pos.z) >= OUTER_END_START_DISTANCE;
}

// Island sampling: 1/64 probability per 16×16 chunk in outer end.
export function shouldSpawnIsland(chunkKey: string, roll: number): boolean {
  // chunkKey is used only to hash with roll deterministically
  let hash = 0;
  for (let i = 0; i < chunkKey.length; i++) {
    hash = ((hash << 5) - hash + chunkKey.charCodeAt(i)) | 0;
  }
  const probability = 1 / 64;
  return ((hash >>> 0) / 0xffffffff) * roll < probability;
}

// Void below y = -64: entities falling below are instantly killed.
export const END_VOID_Y = -64;

export function isInEndVoid(pos: Vec3): boolean {
  return pos.y < END_VOID_Y;
}
