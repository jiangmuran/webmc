// Amanatides & Woo "fast voxel traversal" DDA raycast. Steps through
// integer voxels along a ray until a hit block is found or maxDistance.

export interface RayOrigin {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}

export interface RayHit {
  x: number;
  y: number;
  z: number;
  face: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west';
  distance: number;
}

export interface BlockSampler {
  isSolid: (x: number, y: number, z: number) => boolean;
}

export function ddaRaycast(r: RayOrigin, maxDistance: number, s: BlockSampler): RayHit | null {
  let x = Math.floor(r.x);
  let y = Math.floor(r.y);
  let z = Math.floor(r.z);

  const stepX = Math.sign(r.dx) || 0;
  const stepY = Math.sign(r.dy) || 0;
  const stepZ = Math.sign(r.dz) || 0;

  const tDeltaX = stepX === 0 ? Infinity : Math.abs(1 / r.dx);
  const tDeltaY = stepY === 0 ? Infinity : Math.abs(1 / r.dy);
  const tDeltaZ = stepZ === 0 ? Infinity : Math.abs(1 / r.dz);

  let tMaxX = stepX > 0 ? (x + 1 - r.x) * tDeltaX : stepX < 0 ? (r.x - x) * tDeltaX : Infinity;
  let tMaxY = stepY > 0 ? (y + 1 - r.y) * tDeltaY : stepY < 0 ? (r.y - y) * tDeltaY : Infinity;
  let tMaxZ = stepZ > 0 ? (z + 1 - r.z) * tDeltaZ : stepZ < 0 ? (r.z - z) * tDeltaZ : Infinity;

  let face: RayHit['face'] = 'top';
  for (let guard = 0; guard < 1_000_000; guard++) {
    if (s.isSolid(x, y, z)) {
      return { x, y, z, face, distance: Math.min(tMaxX, tMaxY, tMaxZ) };
    }
    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
      if (tMaxX > maxDistance) return null;
      x += stepX;
      face = stepX > 0 ? 'west' : 'east';
      tMaxX += tDeltaX;
    } else if (tMaxY < tMaxZ) {
      if (tMaxY > maxDistance) return null;
      y += stepY;
      face = stepY > 0 ? 'bottom' : 'top';
      tMaxY += tDeltaY;
    } else {
      if (tMaxZ > maxDistance) return null;
      z += stepZ;
      face = stepZ > 0 ? 'north' : 'south';
      tMaxZ += tDeltaZ;
    }
  }
  return null;
}
