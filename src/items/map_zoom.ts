// Map zoom/scale. A filled map can be zoomed-out in a crafting grid by
// surrounding it with 8 paper; each zoom raises the scale 1..4 (pixels
// per block: 1 → 2 → 4 → 8 → 16). Cannot zoom past scale 4.

import type { MapScale } from './map_item';

export interface MapZoomQuery {
  currentScale: MapScale;
  paperAvailable: number;
}

export interface MapZoomResult {
  accepted: boolean;
  newScale: MapScale;
  consumedPaper: number;
}

export function zoomMap(q: MapZoomQuery): MapZoomResult {
  if (q.currentScale >= 4) return { accepted: false, newScale: q.currentScale, consumedPaper: 0 };
  if (q.paperAvailable < 8) return { accepted: false, newScale: q.currentScale, consumedPaper: 0 };
  const next = (q.currentScale + 1) as MapScale;
  return { accepted: true, newScale: next, consumedPaper: 8 };
}

// Empty map crafting: 8 paper + 1 compass = filled map (scale 0). Without
// the compass, just an empty map (no scale, no marker).
export interface MapCraftQuery {
  paper: number;
  compass: number;
}

export type MapCraftResult =
  | { kind: 'filled_map'; scale: 0 }
  | { kind: 'empty_map' }
  | { kind: 'refused' };

export function craftMap(q: MapCraftQuery): MapCraftResult {
  if (q.paper < 8) return { kind: 'refused' };
  if (q.compass >= 1) return { kind: 'filled_map', scale: 0 };
  return { kind: 'empty_map' };
}

// Locked maps: crafting with a filled map + glass pane = locked copy
// that never updates.
export function lockMap(baseMap: { scale: MapScale }): {
  kind: 'locked_map';
  scale: MapScale;
} {
  return { kind: 'locked_map', scale: baseMap.scale };
}
