// Minimap zoom. Cycle through N zoom levels; each level is 2^k chunks
// visible (k = 0..4).

export const MIN_ZOOM = 0;
export const MAX_ZOOM = 4;

export interface Minimap {
  zoomLevel: number;
}

export function makeMinimap(): Minimap {
  return { zoomLevel: 0 };
}

export function zoomIn(m: Minimap): void {
  m.zoomLevel = Math.max(MIN_ZOOM, m.zoomLevel - 1);
}

export function zoomOut(m: Minimap): void {
  m.zoomLevel = Math.min(MAX_ZOOM, m.zoomLevel + 1);
}

export function chunksVisible(m: Minimap): number {
  return 1 << m.zoomLevel;
}

export function blocksVisible(m: Minimap): number {
  return chunksVisible(m) * 16;
}

// Returns whether an entity at (dx, dz) (block offset from player) is
// within the minimap view.
export function inView(m: Minimap, dx: number, dz: number): boolean {
  const half = blocksVisible(m) / 2;
  return Math.abs(dx) <= half && Math.abs(dz) <= half;
}
