// Frustum culling via plane-AABB intersection. The 6 planes are given as
// (nx, ny, nz, d) with the normal pointing INTO the frustum, so a point
// is inside iff nx*x + ny*y + nz*z + d >= 0 for all planes.
// An AABB is culled iff the "positive vertex" — the corner of the box
// farthest along the plane normal — is on the negative side.

export interface Plane {
  nx: number;
  ny: number;
  nz: number;
  d: number;
}

export interface Aabb {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export function aabbIntersectsFrustum(aabb: Aabb, planes: readonly Plane[]): boolean {
  for (const p of planes) {
    const px = p.nx >= 0 ? aabb.maxX : aabb.minX;
    const py = p.ny >= 0 ? aabb.maxY : aabb.minY;
    const pz = p.nz >= 0 ? aabb.maxZ : aabb.minZ;
    if (p.nx * px + p.ny * py + p.nz * pz + p.d < 0) return false;
  }
  return true;
}

// Chunk-aligned AABB helper: given chunk (cx, cz) and vertical column
// [minY, maxY], return its world-space AABB for culling.
export function chunkAabb(cx: number, cz: number, minY: number, maxY: number): Aabb {
  return {
    minX: cx * 16,
    minY,
    minZ: cz * 16,
    maxX: cx * 16 + 16,
    maxY,
    maxZ: cz * 16 + 16,
  };
}

// Build a "box planes" orthographic frustum from a view-volume AABB.
// Used mostly in tests — a real camera provides 6 planes from its
// projection × view matrix.
export function aabbToPlanes(aabb: Aabb): Plane[] {
  return [
    { nx: 1, ny: 0, nz: 0, d: -aabb.minX },
    { nx: -1, ny: 0, nz: 0, d: aabb.maxX },
    { nx: 0, ny: 1, nz: 0, d: -aabb.minY },
    { nx: 0, ny: -1, nz: 0, d: aabb.maxY },
    { nx: 0, ny: 0, nz: 1, d: -aabb.minZ },
    { nx: 0, ny: 0, nz: -1, d: aabb.maxZ },
  ];
}
