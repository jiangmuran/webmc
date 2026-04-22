// Entity billboards: 2D rectangles that always face the camera. Used for
// player name tags, boss health bars, and particle sprites. This module
// computes the per-entity billboard transform + culling.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BillboardQuery {
  entityPos: Vec3;
  entityHeight: number;
  cameraPos: Vec3;
  cameraForward: Vec3; // unit vector
  sneaking: boolean;
  invisible: boolean;
}

export interface BillboardResult {
  visible: boolean;
  worldPos: Vec3; // top-center of the billboard
  opacity: number;
  scale: number;
}

const MAX_VISIBLE_DISTANCE = 64;
const SNEAK_HIDE_DISTANCE = 32;

export function computeBillboard(q: BillboardQuery): BillboardResult {
  if (q.invisible) {
    return { visible: false, worldPos: q.entityPos, opacity: 0, scale: 0 };
  }
  const dx = q.entityPos.x - q.cameraPos.x;
  const dy = q.entityPos.y - q.cameraPos.y;
  const dz = q.entityPos.z - q.cameraPos.z;
  const dist = Math.hypot(dx, dy, dz);
  const maxDist = q.sneaking ? SNEAK_HIDE_DISTANCE : MAX_VISIBLE_DISTANCE;
  if (dist > maxDist) {
    return { visible: false, worldPos: q.entityPos, opacity: 0, scale: 0 };
  }
  // Fade over the last 4 blocks of visibility.
  const fadeStart = maxDist - 4;
  const opacity = dist <= fadeStart ? 1 : Math.max(0, 1 - (dist - fadeStart) / 4);
  const scale = Math.max(0.5, Math.min(1.5, 1 - dist / 32));
  const worldPos: Vec3 = {
    x: q.entityPos.x,
    y: q.entityPos.y + q.entityHeight + 0.3,
    z: q.entityPos.z,
  };
  // Behind-camera cull: dot against forward.
  const dot =
    (dx * q.cameraForward.x + dy * q.cameraForward.y + dz * q.cameraForward.z) / (dist || 1);
  if (dot < 0) {
    return { visible: false, worldPos, opacity: 0, scale };
  }
  return { visible: true, worldPos, opacity, scale };
}

// Screen-space anchor: project the billboard world-pos to NDC for text
// layout. Returns null if behind camera. Uses a simple look-at model —
// production shader does a proper MVP transform.
export interface ProjectQuery {
  worldPos: Vec3;
  cameraPos: Vec3;
  cameraForward: Vec3;
  cameraUp: Vec3;
  fovRadians: number;
  aspect: number;
}

export function projectToNdc(q: ProjectQuery): { x: number; y: number } | null {
  const dx = q.worldPos.x - q.cameraPos.x;
  const dy = q.worldPos.y - q.cameraPos.y;
  const dz = q.worldPos.z - q.cameraPos.z;
  const forward = dx * q.cameraForward.x + dy * q.cameraForward.y + dz * q.cameraForward.z;
  if (forward <= 0) return null;
  const rightX = q.cameraForward.y * q.cameraUp.z - q.cameraForward.z * q.cameraUp.y;
  const rightY = q.cameraForward.z * q.cameraUp.x - q.cameraForward.x * q.cameraUp.z;
  const rightZ = q.cameraForward.x * q.cameraUp.y - q.cameraForward.y * q.cameraUp.x;
  const side = dx * rightX + dy * rightY + dz * rightZ;
  const up = dx * q.cameraUp.x + dy * q.cameraUp.y + dz * q.cameraUp.z;
  const tanHalfFov = Math.tan(q.fovRadians / 2);
  return {
    x: side / (forward * tanHalfFov * q.aspect),
    y: up / (forward * tanHalfFov),
  };
}
