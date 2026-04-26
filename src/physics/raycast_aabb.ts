export interface RayAABBHit {
  tMin: number;
  tMax: number;
}

export interface Vec3Lit {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface AABBLit {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

// Shared mutable result. Callers read tMin/tMax synchronously; the next
// call may overwrite. Picker loops in main.ts (mob aim, hover crosshair)
// were allocating one fresh result object per mob per frame.
const SHARED_HIT: RayAABBHit = { tMin: 0, tMax: 0 };

export function intersectRayAABB(
  origin: Vec3Lit,
  dir: Vec3Lit,
  box: AABBLit,
  maxDist: number,
): RayAABBHit | null {
  let tmin = 0;
  let tmax = maxDist;

  // Unrolled per-axis to avoid the per-call ['x','y','z'] const array
  // allocation that JS engines don't always sink.
  const dx = dir.x;
  if (Math.abs(dx) < 1e-6) {
    if (origin.x < box.minX || origin.x > box.maxX) return null;
  } else {
    const inv = 1 / dx;
    let t1 = (box.minX - origin.x) * inv;
    let t2 = (box.maxX - origin.x) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }

  const dy = dir.y;
  if (Math.abs(dy) < 1e-6) {
    if (origin.y < box.minY || origin.y > box.maxY) return null;
  } else {
    const inv = 1 / dy;
    let t1 = (box.minY - origin.y) * inv;
    let t2 = (box.maxY - origin.y) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }

  const dz = dir.z;
  if (Math.abs(dz) < 1e-6) {
    if (origin.z < box.minZ || origin.z > box.maxZ) return null;
  } else {
    const inv = 1 / dz;
    let t1 = (box.minZ - origin.z) * inv;
    let t2 = (box.maxZ - origin.z) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }

  if (tmax < 0) return null;
  SHARED_HIT.tMin = tmin;
  SHARED_HIT.tMax = tmax;
  return SHARED_HIT;
}
