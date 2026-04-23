// Map item drawing. Each pixel represents blocks^2 from center.
// Scale 0..4 where each scale halves resolution.

export const MAP_WIDTH = 128;
export const MAP_HEIGHT = 128;

export function blocksPerPixel(scale: 0 | 1 | 2 | 3 | 4): number {
  return 1 << scale;
}

export function mapCoveredArea(scale: 0 | 1 | 2 | 3 | 4): number {
  const bpp = blocksPerPixel(scale);
  return MAP_WIDTH * bpp * MAP_HEIGHT * bpp;
}

export interface MapCenter {
  x: number;
  z: number;
}

export function worldToMapPixel(
  world: { x: number; z: number },
  center: MapCenter,
  scale: 0 | 1 | 2 | 3 | 4,
): { u: number; v: number } {
  const bpp = blocksPerPixel(scale);
  const u = Math.floor((world.x - center.x) / bpp + MAP_WIDTH / 2);
  const v = Math.floor((world.z - center.z) / bpp + MAP_HEIGHT / 2);
  return { u, v };
}

export function isOnMap(u: number, v: number): boolean {
  return u >= 0 && u < MAP_WIDTH && v >= 0 && v < MAP_HEIGHT;
}
