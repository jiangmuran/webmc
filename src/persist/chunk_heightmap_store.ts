export type HeightmapType =
  | 'world_surface'
  | 'motion_blocking'
  | 'motion_blocking_no_leaves'
  | 'ocean_floor';

export interface Heightmap {
  data: Int16Array;
  type: HeightmapType;
}

export const WIDTH = 16;

export function indexOf(x: number, z: number): number {
  return z * WIDTH + x;
}

export function getHeight(h: Heightmap, x: number, z: number): number {
  return h.data[indexOf(x, z)] ?? 0;
}

export function setHeight(h: Heightmap, x: number, z: number, y: number): void {
  h.data[indexOf(x, z)] = y;
}
