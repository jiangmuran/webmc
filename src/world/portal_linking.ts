// Nether portal linking. Translated overworld ↔ nether coords; find
// nearest existing matching portal within 128 blocks; otherwise generate
// a new one. Pure logic module — caller runs the search + placement.

import type { DimensionId } from './dimension';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PortalRecord {
  pos: Vec3;
  dimension: DimensionId;
}

// Translate coords across dimensions: overworld→nether divides by 8,
// nether→overworld multiplies.
export function translateCoords(from: DimensionId, to: DimensionId, pos: Vec3): Vec3 {
  if (from === 'overworld' && to === 'nether') {
    return { x: Math.round(pos.x / 8), y: pos.y, z: Math.round(pos.z / 8) };
  }
  if (from === 'nether' && to === 'overworld') {
    return { x: pos.x * 8, y: pos.y, z: pos.z * 8 };
  }
  return { ...pos };
}

// Search for the nearest existing portal within `radius` cubes of blocks
// (nether: 128, overworld: 128). Returns null if none.
export function findNearestPortal(
  target: Vec3,
  portals: readonly PortalRecord[],
  dimension: DimensionId,
  radius: number,
): PortalRecord | null {
  let best: PortalRecord | null = null;
  let bestDistSq = radius * radius + 1;
  for (const p of portals) {
    if (p.dimension !== dimension) continue;
    const dx = p.pos.x - target.x;
    const dy = p.pos.y - target.y;
    const dz = p.pos.z - target.z;
    const dsq = dx * dx + dy * dy + dz * dz;
    if (dsq <= radius * radius && dsq < bestDistSq) {
      best = p;
      bestDistSq = dsq;
    }
  }
  return best;
}

export const NETHER_SEARCH_RADIUS = 128;
export const OVERWORLD_SEARCH_RADIUS = 128;
