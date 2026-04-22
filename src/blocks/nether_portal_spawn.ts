// Nether portal ignition. A player uses flint-and-steel (or a fire
// charge via dispenser) on the air block bounded by an obsidian frame.
// Valid frames: 4×5 rectangle (inner 2×3), up to 23×23 outer (inner
// 21×21), any intermediate size. Obsidian corners don't need to be
// present (except at frame corners — MC quirk).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type PortalAxis = 'x' | 'z';

export interface FrameLookup {
  isObsidian: (x: number, y: number, z: number) => boolean;
  isAir: (x: number, y: number, z: number) => boolean;
}

export interface IgniteQuery {
  ignitePos: Vec3;
  axis: PortalAxis; // which horizontal axis the frame is aligned to
  lookup: FrameLookup;
}

export interface IgniteResult {
  success: boolean;
  portalBlocks: readonly Vec3[];
  innerWidth: number;
  innerHeight: number;
}

const MIN_W = 2;
const MAX_W = 21;
const MIN_H = 3;
const MAX_H = 21;

// Scan downward from ignitePos for the bottom of the inner column, then
// outward for the width, upward for the height.
export function tryIgnitePortal(q: IgniteQuery): IgniteResult {
  const { lookup, ignitePos, axis } = q;
  const horizAxis = axis === 'x' ? 'x' : 'z';

  // Find lowest air in column.
  let bottomY = ignitePos.y;
  while (bottomY > ignitePos.y - MAX_H && lookup.isAir(ignitePos.x, bottomY - 1, ignitePos.z)) {
    bottomY--;
  }

  // Check floor of frame.
  if (!lookup.isObsidian(ignitePos.x, bottomY - 1, ignitePos.z)) {
    return { success: false, portalBlocks: [], innerWidth: 0, innerHeight: 0 };
  }

  // Scan width along axis.
  let minCoord = horizAxis === 'x' ? ignitePos.x : ignitePos.z;
  let maxCoord = minCoord;
  const isAirAt = (c: number): boolean => {
    if (horizAxis === 'x') return lookup.isAir(c, bottomY, ignitePos.z);
    return lookup.isAir(ignitePos.x, bottomY, c);
  };
  while (maxCoord - minCoord + 1 < MAX_W && isAirAt(minCoord - 1)) minCoord--;
  while (maxCoord - minCoord + 1 < MAX_W && isAirAt(maxCoord + 1)) maxCoord++;
  const innerWidth = maxCoord - minCoord + 1;
  if (innerWidth < MIN_W)
    return { success: false, portalBlocks: [], innerWidth: 0, innerHeight: 0 };

  // Scan height.
  let topY = bottomY;
  const columnClear = (y: number): boolean => {
    for (let c = minCoord; c <= maxCoord; c++) {
      const ok =
        horizAxis === 'x' ? lookup.isAir(c, y, ignitePos.z) : lookup.isAir(ignitePos.x, y, c);
      if (!ok) return false;
    }
    return true;
  };
  while (topY - bottomY + 1 < MAX_H && columnClear(topY + 1)) topY++;
  const innerHeight = topY - bottomY + 1;
  if (innerHeight < MIN_H) {
    return { success: false, portalBlocks: [], innerWidth: 0, innerHeight: 0 };
  }

  // Collect portal blocks.
  const blocks: Vec3[] = [];
  for (let y = bottomY; y <= topY; y++) {
    for (let c = minCoord; c <= maxCoord; c++) {
      blocks.push(horizAxis === 'x' ? { x: c, y, z: ignitePos.z } : { x: ignitePos.x, y, z: c });
    }
  }
  return { success: true, portalBlocks: blocks, innerWidth, innerHeight };
}

export const PORTAL_MIN_INNER_WIDTH = MIN_W;
export const PORTAL_MIN_INNER_HEIGHT = MIN_H;
