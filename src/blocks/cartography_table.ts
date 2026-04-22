// Cartography table. Three operations: zoom out (1/1 → 1/2 → ... → 1/16),
// duplicate (two maps → two identical), and mark landmarks (map + compass
// pointer, map + banner glyph).

export interface MapItem {
  scale: 0 | 1 | 2 | 3 | 4; // 0 = 1/1 scale (128×128 blocks), 4 = 1/16 (2048×2048)
  centerX: number;
  centerZ: number;
  markedLocator: boolean;
  bannerMarks: { x: number; z: number; color: string; name?: string }[];
}

export function makeMap(centerX = 0, centerZ = 0): MapItem {
  return { scale: 0, centerX, centerZ, markedLocator: false, bannerMarks: [] };
}

export function zoomOut(map: MapItem): boolean {
  if (map.scale >= 4) return false;
  map.scale = (map.scale + 1) as MapItem['scale'];
  return true;
}

export function duplicateMap(src: MapItem): MapItem {
  return {
    scale: src.scale,
    centerX: src.centerX,
    centerZ: src.centerZ,
    markedLocator: src.markedLocator,
    bannerMarks: src.bannerMarks.map((m) => ({ ...m })),
  };
}

export function toggleLocator(map: MapItem): void {
  map.markedLocator = !map.markedLocator;
}

export function markBanner(
  map: MapItem,
  mark: { x: number; z: number; color: string; name?: string },
): void {
  map.bannerMarks.push(mark);
}

export function scaleBlockRadius(map: MapItem): number {
  return 64 * Math.pow(2, map.scale);
}
