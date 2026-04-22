// Frustum culling helper. Tests an AABB against the 6 planes of a
// view frustum (expressed as plane equations a*x + b*y + c*z + d ≥ 0).

export interface Plane {
  a: number;
  b: number;
  c: number;
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

export function aabbOutsidePlane(p: Plane, box: Aabb): boolean {
  // pick the corner most aligned with plane normal
  const x = p.a >= 0 ? box.maxX : box.minX;
  const y = p.b >= 0 ? box.maxY : box.minY;
  const z = p.c >= 0 ? box.maxZ : box.minZ;
  return p.a * x + p.b * y + p.c * z + p.d < 0;
}

export function aabbInFrustum(planes: Plane[], box: Aabb): boolean {
  for (const p of planes) {
    if (aabbOutsidePlane(p, box)) return false;
  }
  return true;
}

// Per-chunk occlusion cache: last check tick + visible bool.
export interface OcclusionCache {
  lastCheckTick: number;
  visible: boolean;
}

export const OCCLUSION_REFRESH_TICKS = 6;

export function cachedVisible(
  cache: OcclusionCache,
  currentTick: number,
  compute: () => boolean,
): boolean {
  if (currentTick - cache.lastCheckTick >= OCCLUSION_REFRESH_TICKS) {
    cache.visible = compute();
    cache.lastCheckTick = currentTick;
  }
  return cache.visible;
}
