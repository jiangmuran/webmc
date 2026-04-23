export const MAX_ZOOM = 4;

export function blocksPerPixelAt(zoom: number): number {
  const clamped = Math.max(0, Math.min(MAX_ZOOM, zoom));
  return 1 << clamped;
}

export function areaBlocks(zoom: number): number {
  const bpp = blocksPerPixelAt(zoom);
  return bpp * 128 * bpp * 128;
}

export function canZoomOut(zoom: number): boolean {
  return zoom < MAX_ZOOM;
}
