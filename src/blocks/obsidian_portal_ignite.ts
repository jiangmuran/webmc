// Nether portal ignition. A valid obsidian frame (4x5 min, 23x23 max)
// of obsidian with a hollow interior, ignited by flint-and-steel or
// fire charge inside the frame.

export interface PortalScanQuery {
  // returns true if position holds obsidian
  isObsidian: (x: number, y: number, z: number) => boolean;
  // ignition position (must be inside frame)
  ix: number;
  iy: number;
  iz: number;
  axis: 'x' | 'z';
}

export const MIN_INNER_WIDTH = 2;
export const MAX_INNER_WIDTH = 21;
export const MIN_INNER_HEIGHT = 3;
export const MAX_INNER_HEIGHT = 21;

export interface PortalShape {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  axis: 'x' | 'z';
}

// Scan outward in axis direction + vertical to find frame bounds.
export function scanFrame(q: PortalScanQuery): PortalShape | null {
  const vCheck = (x: number, y: number, z: number) => q.isObsidian(x, y, z);
  // vertical extents
  let minY = q.iy;
  while (!vCheck(q.ix, minY - 1, q.iz)) {
    minY -= 1;
    if (q.iy - minY > MAX_INNER_HEIGHT + 1) return null;
  }
  let maxY = q.iy;
  while (!vCheck(q.ix, maxY + 1, q.iz)) {
    maxY += 1;
    if (maxY - q.iy > MAX_INNER_HEIGHT + 1) return null;
  }
  const innerH = maxY - minY + 1;
  if (innerH < MIN_INNER_HEIGHT || innerH > MAX_INNER_HEIGHT) return null;

  // horizontal extents along axis
  let minA = q.axis === 'x' ? q.ix : q.iz;
  let maxA = minA;
  const atA = (a: number) =>
    q.axis === 'x' ? vCheck(a, minY - 1, q.iz) : vCheck(q.ix, minY - 1, a);
  while (!atA(minA - 1)) {
    minA -= 1;
    if ((q.axis === 'x' ? q.ix : q.iz) - minA > MAX_INNER_WIDTH + 1) return null;
  }
  while (!atA(maxA + 1)) {
    maxA += 1;
    if (maxA - (q.axis === 'x' ? q.ix : q.iz) > MAX_INNER_WIDTH + 1) return null;
  }
  const innerW = maxA - minA + 1;
  if (innerW < MIN_INNER_WIDTH || innerW > MAX_INNER_WIDTH) return null;

  if (q.axis === 'x') {
    return { minX: minA, maxX: maxA, minY, maxY, minZ: q.iz, maxZ: q.iz, axis: 'x' };
  }
  return { minX: q.ix, maxX: q.ix, minY, maxY, minZ: minA, maxZ: maxA, axis: 'z' };
}

// Portal block count: innerW * innerH.
export function portalBlockCount(s: PortalShape): number {
  const w = s.axis === 'x' ? s.maxX - s.minX + 1 : s.maxZ - s.minZ + 1;
  const h = s.maxY - s.minY + 1;
  return w * h;
}
