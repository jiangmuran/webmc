export interface Plane {
  nx: number;
  ny: number;
  nz: number;
  d: number;
}

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export function signedDistanceToPoint(p: Plane, x: number, y: number, z: number): number {
  return p.nx * x + p.ny * y + p.nz * z + p.d;
}

export function aabbBehindPlane(p: Plane, a: AABB): boolean {
  const px = p.nx >= 0 ? a.maxX : a.minX;
  const py = p.ny >= 0 ? a.maxY : a.minY;
  const pz = p.nz >= 0 ? a.maxZ : a.minZ;
  return signedDistanceToPoint(p, px, py, pz) < 0;
}

export function aabbInsideFrustum(planes: Plane[], a: AABB): boolean {
  for (const plane of planes) {
    if (aabbBehindPlane(plane, a)) return false;
  }
  return true;
}
