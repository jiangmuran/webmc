// Map tracking. Filled maps record chunk colors as the player explores.
// A map has a fixed center, a scale level, and an exploration bit-set.

export type MapScale = 0 | 1 | 2 | 3 | 4;

export interface MapItem {
  centerX: number;
  centerZ: number;
  scale: MapScale;
  exploredBits: Uint8Array; // 128x128 tiles, bit per tile
}

export const MAP_SIZE = 128;

export function scaleTileBlocks(scale: MapScale): number {
  return 1 << scale;
}

export function worldToTile(m: MapItem, wx: number, wz: number): { tx: number; tz: number } | null {
  const block = scaleTileBlocks(m.scale);
  const tileWidth = MAP_SIZE * block;
  const ox = wx - (m.centerX - tileWidth / 2);
  const oz = wz - (m.centerZ - tileWidth / 2);
  if (ox < 0 || ox >= tileWidth || oz < 0 || oz >= tileWidth) return null;
  return { tx: Math.floor(ox / block), tz: Math.floor(oz / block) };
}

function tileIndex(tx: number, tz: number): number {
  return tz * MAP_SIZE + tx;
}

export function isExplored(m: MapItem, tx: number, tz: number): boolean {
  const idx = tileIndex(tx, tz);
  return ((m.exploredBits[idx >> 3] ?? 0) & (1 << (idx & 7))) !== 0;
}

export function markExplored(m: MapItem, tx: number, tz: number): void {
  const idx = tileIndex(tx, tz);
  const byte = idx >> 3;
  m.exploredBits[byte] = (m.exploredBits[byte] ?? 0) | (1 << (idx & 7));
}

export function makeMap(centerX: number, centerZ: number, scale: MapScale): MapItem {
  return {
    centerX,
    centerZ,
    scale,
    exploredBits: new Uint8Array((MAP_SIZE * MAP_SIZE) / 8),
  };
}

// Zoom: increments scale by 1, empties exploration. Max scale = 4.
export function zoomOut(m: MapItem): boolean {
  if (m.scale >= 4) return false;
  m.scale = (m.scale + 1) as MapScale;
  m.exploredBits.fill(0);
  return true;
}
