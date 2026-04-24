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

export function intersectRayAABB(
  origin: Vec3Lit,
  dir: Vec3Lit,
  box: AABBLit,
  maxDist: number,
): RayAABBHit | null {
  let tmin = 0;
  let tmax = maxDist;
  for (const axis of ['x', 'y', 'z'] as const) {
    const d = axis === 'x' ? dir.x : axis === 'y' ? dir.y : dir.z;
    const o = axis === 'x' ? origin.x : axis === 'y' ? origin.y : origin.z;
    const bMin = axis === 'x' ? box.minX : axis === 'y' ? box.minY : box.minZ;
    const bMax = axis === 'x' ? box.maxX : axis === 'y' ? box.maxY : box.maxZ;
    if (Math.abs(d) < 1e-6) {
      if (o < bMin || o > bMax) return null;
      continue;
    }
    const inv = 1 / d;
    let t1 = (bMin - o) * inv;
    let t2 = (bMax - o) * inv;
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
  return { tMin: tmin, tMax: tmax };
}
