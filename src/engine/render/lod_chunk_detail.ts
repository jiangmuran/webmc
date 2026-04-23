export type LOD = 0 | 1 | 2 | 3;

export const LOD_DISTANCE_THRESHOLDS = [64, 128, 256];

export function lodForDistance(distance: number): LOD {
  if (distance < (LOD_DISTANCE_THRESHOLDS[0] ?? 0)) return 0;
  if (distance < (LOD_DISTANCE_THRESHOLDS[1] ?? 0)) return 1;
  if (distance < (LOD_DISTANCE_THRESHOLDS[2] ?? 0)) return 2;
  return 3;
}

export function verticesPerChunk(lod: LOD): number {
  switch (lod) {
    case 0:
      return 4096;
    case 1:
      return 1024;
    case 2:
      return 256;
    case 3:
      return 64;
  }
}
