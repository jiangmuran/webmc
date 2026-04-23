// Portal linking search. Given a target position, expand outward in a
// 128-block box to find existing portal. If none, mark a build slot.

export interface PortalIndex {
  portals: { x: number; y: number; z: number }[];
}

export const SEARCH_RADIUS = 128;

export function findExisting(
  idx: PortalIndex,
  target: { x: number; y: number; z: number },
): { x: number; y: number; z: number } | null {
  let best: { x: number; y: number; z: number } | null = null;
  let bestD = Infinity;
  for (const p of idx.portals) {
    const dx = p.x - target.x;
    const dz = p.z - target.z;
    const d = Math.hypot(dx, dz);
    if (d <= SEARCH_RADIUS && d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

export function chooseBuildSpot(target: { x: number; y: number; z: number }): {
  x: number;
  y: number;
  z: number;
} {
  return { x: target.x, y: Math.max(32, Math.min(96, target.y)), z: target.z };
}
