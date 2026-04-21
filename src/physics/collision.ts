export interface Vec3Lite {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  halfX: number;
  halfY: number;
  halfZ: number;
}

const EPS = 1e-6;

export type SolidSampler = (x: number, y: number, z: number) => boolean;

export function aabbIntersectsSolid(pos: Vec3Lite, box: AABB, isSolid: SolidSampler): boolean {
  const minX = Math.floor(pos.x - box.halfX);
  const maxX = Math.floor(pos.x + box.halfX - EPS);
  const minY = Math.floor(pos.y - box.halfY);
  const maxY = Math.floor(pos.y + box.halfY - EPS);
  const minZ = Math.floor(pos.z - box.halfZ);
  const maxZ = Math.floor(pos.z + box.halfZ - EPS);
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        if (isSolid(x, y, z)) return true;
      }
    }
  }
  return false;
}

export interface SweepResult {
  hitX: boolean;
  hitY: boolean;
  hitZ: boolean;
  onGround: boolean;
}

// Per-axis separating-axis resolution. For the low velocities we see in M1
// (≤ ~15 m/s at 60 FPS = ~0.25 m/frame) this does not tunnel through 1m
// voxels. When M7's fast mobs arrive we upgrade to swept collision.
export function sweepMove(
  pos: Vec3Lite,
  box: AABB,
  dv: Vec3Lite,
  isSolid: SolidSampler,
): SweepResult {
  const out: SweepResult = { hitX: false, hitY: false, hitZ: false, onGround: false };

  const px = pos.x;
  pos.x = px + dv.x;
  if (aabbIntersectsSolid(pos, box, isSolid)) {
    pos.x = px;
    dv.x = 0;
    out.hitX = true;
  }

  const py = pos.y;
  pos.y = py + dv.y;
  if (aabbIntersectsSolid(pos, box, isSolid)) {
    pos.y = py;
    if (dv.y < 0) out.onGround = true;
    dv.y = 0;
    out.hitY = true;
  }

  const pz = pos.z;
  pos.z = pz + dv.z;
  if (aabbIntersectsSolid(pos, box, isSolid)) {
    pos.z = pz;
    dv.z = 0;
    out.hitZ = true;
  }

  return out;
}
