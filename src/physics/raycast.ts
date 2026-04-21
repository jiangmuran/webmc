import type { SolidSampler, Vec3Lite } from './collision';

export type BlockFace = 0 | 1 | 2 | 3 | 4 | 5;

export const FACE_NX: BlockFace = 0;
export const FACE_PX: BlockFace = 1;
export const FACE_NY: BlockFace = 2;
export const FACE_PY: BlockFace = 3;
export const FACE_NZ: BlockFace = 4;
export const FACE_PZ: BlockFace = 5;

export interface RayHit {
  bx: number;
  by: number;
  bz: number;
  face: BlockFace;
  distance: number;
}

const FACE_FROM_AXIS_AND_STEP: Record<number, Record<number, BlockFace>> = {
  0: { 1: FACE_NX, [-1]: FACE_PX },
  1: { 1: FACE_NY, [-1]: FACE_PY },
  2: { 1: FACE_NZ, [-1]: FACE_PZ },
};

// Amanatides–Woo voxel ray traversal. Walks voxels in order along a ray
// until maxDistance, stopping at the first solid cell. Face is the one the
// ray entered through.
export function raycastVoxels(
  origin: Vec3Lite,
  dir: Vec3Lite,
  maxDistance: number,
  isSolid: SolidSampler,
): RayHit | null {
  const len = Math.hypot(dir.x, dir.y, dir.z);
  if (len === 0) return null;
  const dx = dir.x / len;
  const dy = dir.y / len;
  const dz = dir.z / len;

  let vx = Math.floor(origin.x);
  let vy = Math.floor(origin.y);
  let vz = Math.floor(origin.z);

  const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
  const stepZ = dz > 0 ? 1 : dz < 0 ? -1 : 0;

  const deltaX = dx === 0 ? Infinity : Math.abs(1 / dx);
  const deltaY = dy === 0 ? Infinity : Math.abs(1 / dy);
  const deltaZ = dz === 0 ? Infinity : Math.abs(1 / dz);

  let tMaxX = stepX === 0 ? Infinity : ((stepX > 0 ? vx + 1 : vx) - origin.x) / dx;
  let tMaxY = stepY === 0 ? Infinity : ((stepY > 0 ? vy + 1 : vy) - origin.y) / dy;
  let tMaxZ = stepZ === 0 ? Infinity : ((stepZ > 0 ? vz + 1 : vz) - origin.z) / dz;

  // Starting voxel hit — the ray origin is inside it, so no face was crossed.
  // Callers (place/break) usually want to ignore the origin voxel; we return
  // face=FACE_PY as a sentinel in that case and distance=0. Most callers
  // should check distance > 0 before using face.
  if (isSolid(vx, vy, vz)) {
    return { bx: vx, by: vy, bz: vz, face: FACE_PY, distance: 0 };
  }

  let distance = 0;
  let enteredAxis = 0;
  let enteredStep = 0;

  while (distance <= maxDistance) {
    if (tMaxX < tMaxY) {
      if (tMaxX < tMaxZ) {
        vx += stepX;
        distance = tMaxX;
        tMaxX += deltaX;
        enteredAxis = 0;
        enteredStep = stepX;
      } else {
        vz += stepZ;
        distance = tMaxZ;
        tMaxZ += deltaZ;
        enteredAxis = 2;
        enteredStep = stepZ;
      }
    } else {
      if (tMaxY < tMaxZ) {
        vy += stepY;
        distance = tMaxY;
        tMaxY += deltaY;
        enteredAxis = 1;
        enteredStep = stepY;
      } else {
        vz += stepZ;
        distance = tMaxZ;
        tMaxZ += deltaZ;
        enteredAxis = 2;
        enteredStep = stepZ;
      }
    }
    if (distance > maxDistance) return null;
    if (isSolid(vx, vy, vz)) {
      const face = FACE_FROM_AXIS_AND_STEP[enteredAxis]?.[enteredStep] ?? FACE_PY;
      return { bx: vx, by: vy, bz: vz, face, distance };
    }
  }
  return null;
}

const FACE_NORMALS: Record<BlockFace, [number, number, number]> = {
  [FACE_NX]: [-1, 0, 0],
  [FACE_PX]: [1, 0, 0],
  [FACE_NY]: [0, -1, 0],
  [FACE_PY]: [0, 1, 0],
  [FACE_NZ]: [0, 0, -1],
  [FACE_PZ]: [0, 0, 1],
};

export function faceNormal(face: BlockFace): [number, number, number] {
  return FACE_NORMALS[face];
}
