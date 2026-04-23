// Cave carver. Uses 3D noise threshold to remove stone where noise
// exceeds a ramp.

export interface CarveCtx {
  density: (x: number, y: number, z: number) => number;
  threshold: number;
  minY: number;
  maxY: number;
}

export function isCaveVoxel(c: CarveCtx, x: number, y: number, z: number): boolean {
  if (y < c.minY || y > c.maxY) return false;
  return c.density(x, y, z) > c.threshold;
}

export function countVoxels(c: CarveCtx, x0: number, y0: number, z0: number, size: number): number {
  let n = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (isCaveVoxel(c, x0 + x, y0 + y, z0 + z)) n++;
      }
    }
  }
  return n;
}

export const SURFACE_CAVE_MIN_Y = 10;
export const SURFACE_CAVE_MAX_Y = 60;
export const DEEPSLATE_CAVE_MIN_Y = -64;
export const DEEPSLATE_CAVE_MAX_Y = 0;
