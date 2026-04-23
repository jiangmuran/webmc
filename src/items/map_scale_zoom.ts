export const MAX_SCALE = 4;
export const BASE_SIZE = 128;

export function zoomOut(scale: number): number {
  return Math.min(MAX_SCALE, scale + 1);
}

export function blocksPerPixel(scale: number): number {
  return 1 << scale;
}

export function coveredBlocks(scale: number): number {
  return BASE_SIZE * blocksPerPixel(scale);
}

export function pixelFor(worldX: number, centerX: number, scale: number): number {
  return Math.floor((worldX - centerX) / blocksPerPixel(scale)) + BASE_SIZE / 2;
}
