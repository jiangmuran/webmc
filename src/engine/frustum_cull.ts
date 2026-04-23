// Frustum culling: test chunk AABB against 6 frustum planes.

export interface Plane {
  nx: number;
  ny: number;
  nz: number;
  d: number; // ax + by + cz + d = 0
}

export interface AABB {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
}

export function signedDistance(p: Plane, x: number, y: number, z: number): number {
  return p.nx * x + p.ny * y + p.nz * z + p.d;
}

// Returns true if AABB is at least partially inside (or on) every plane.
export function aabbInFrustum(planes: Plane[], box: AABB): boolean {
  for (const p of planes) {
    const px = p.nx >= 0 ? box.max.x : box.min.x;
    const py = p.ny >= 0 ? box.max.y : box.min.y;
    const pz = p.nz >= 0 ? box.max.z : box.min.z;
    if (signedDistance(p, px, py, pz) < 0) return false;
  }
  return true;
}

export function makePlane(nx: number, ny: number, nz: number, d: number): Plane {
  const len = Math.hypot(nx, ny, nz) || 1;
  return { nx: nx / len, ny: ny / len, nz: nz / len, d: d / len };
}
