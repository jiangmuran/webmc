export interface RiverPoint {
  x: number;
  z: number;
  width: number;
}

export function isRiverMouth(pt: RiverPoint, oceanNearby: boolean): boolean {
  return oceanNearby && pt.width >= 4;
}

export function mergedWidthAt(distance: number, riverWidth: number, oceanWidth: number): number {
  const t = Math.max(0, Math.min(1, distance / 32));
  return riverWidth + (oceanWidth - riverWidth) * (1 - t);
}

export function flowDirection(from: RiverPoint, to: RiverPoint): { dx: number; dz: number } {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const len = Math.hypot(dx, dz) || 1;
  return { dx: dx / len, dz: dz / len };
}
