// Filled map item. A 128×128 pixel block-color grid captured at a
// specific center + scale + dimension. Drawing updates the grid using
// the biome-tinted block color at each sampled xz world-position.

export type MapScale = 0 | 1 | 2 | 3 | 4; // 1:1, 1:2, 1:4, 1:8, 1:16 per pixel

export interface FilledMap {
  id: number;
  centerX: number;
  centerZ: number;
  scale: MapScale;
  dimension: string;
  pixels: Uint8Array; // 128×128 palette indices
  trackedPlayers: Set<string>; // player uuids that see their marker on the map
}

export const MAP_DIM = 128;

export function makeFilledMap(
  id: number,
  centerX: number,
  centerZ: number,
  scale: MapScale,
  dim: string,
): FilledMap {
  return {
    id,
    centerX,
    centerZ,
    scale,
    dimension: dim,
    pixels: new Uint8Array(MAP_DIM * MAP_DIM),
    trackedPlayers: new Set(),
  };
}

export function pixelsPerBlock(scale: MapScale): number {
  return 1 << scale;
}

export function worldToMapPixel(
  map: FilledMap,
  x: number,
  z: number,
): { px: number; pz: number } | null {
  const ppb = pixelsPerBlock(map.scale);
  const dx = Math.floor((x - map.centerX) / ppb) + MAP_DIM / 2;
  const dz = Math.floor((z - map.centerZ) / ppb) + MAP_DIM / 2;
  if (dx < 0 || dx >= MAP_DIM || dz < 0 || dz >= MAP_DIM) return null;
  return { px: dx, pz: dz };
}

export function paintPixel(map: FilledMap, px: number, pz: number, color: number): void {
  if (px < 0 || px >= MAP_DIM || pz < 0 || pz >= MAP_DIM) return;
  map.pixels[pz * MAP_DIM + px] = color;
}

export function readPixel(map: FilledMap, px: number, pz: number): number {
  if (px < 0 || px >= MAP_DIM || pz < 0 || pz >= MAP_DIM) return 0;
  return map.pixels[pz * MAP_DIM + px] ?? 0;
}

// Marker overlay: player / banner / destination marker. Rendered on top
// of the pixel grid by the HUD; not baked into pixels.
export interface MapMarker {
  kind: 'player' | 'banner' | 'destination' | 'red_x';
  worldX: number;
  worldZ: number;
  yawRad: number;
  color: number;
  label?: string;
}

export function markerPixelOf(map: FilledMap, m: MapMarker): { px: number; pz: number } | null {
  return worldToMapPixel(map, m.worldX, m.worldZ);
}
