export interface Portal {
  x: number;
  y: number;
  z: number;
}

export function nearestPortal(portals: Portal[], to: Portal, radius: number): Portal | undefined {
  let best: Portal | undefined;
  let bestD = Infinity;
  for (const p of portals) {
    const dx = p.x - to.x;
    const dy = p.y - to.y;
    const dz = p.z - to.z;
    const d = dx * dx + dy * dy + dz * dz;
    if (d < bestD && d <= radius * radius) {
      best = p;
      bestD = d;
    }
  }
  return best;
}

export function shouldCreateIfNone(nearest: Portal | undefined): boolean {
  return nearest === undefined;
}
