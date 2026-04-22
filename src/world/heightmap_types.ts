// Heightmap types. MC maintains five parallel heightmaps per chunk for
// different queries:
//   WORLD_SURFACE — any non-air block (includes leaves, water)
//   WORLD_SURFACE_WG — world-gen variant
//   OCEAN_FLOOR — first solid non-fluid block from the top
//   OCEAN_FLOOR_WG — world-gen variant
//   MOTION_BLOCKING — first block that blocks motion (includes water)
//   MOTION_BLOCKING_NO_LEAVES — motion blocking except leaves

export type HeightmapKind =
  | 'WORLD_SURFACE'
  | 'WORLD_SURFACE_WG'
  | 'OCEAN_FLOOR'
  | 'OCEAN_FLOOR_WG'
  | 'MOTION_BLOCKING'
  | 'MOTION_BLOCKING_NO_LEAVES';

export interface BlockClassification {
  isAir: boolean;
  isLeaves: boolean;
  isFluid: boolean;
  blocksMotion: boolean;
}

export function classify(blockId: string): BlockClassification {
  if (blockId === 'webmc:air') {
    return { isAir: true, isLeaves: false, isFluid: false, blocksMotion: false };
  }
  const isLeaves = blockId.endsWith('_leaves');
  const isFluid = blockId === 'webmc:water' || blockId === 'webmc:lava';
  const blocksMotion = !isFluid;
  return { isAir: false, isLeaves, isFluid, blocksMotion };
}

export function qualifies(kind: HeightmapKind, cls: BlockClassification): boolean {
  if (cls.isAir) return false;
  switch (kind) {
    case 'WORLD_SURFACE':
    case 'WORLD_SURFACE_WG':
      return true;
    case 'OCEAN_FLOOR':
    case 'OCEAN_FLOOR_WG':
      return !cls.isFluid;
    case 'MOTION_BLOCKING':
      return cls.blocksMotion || cls.isFluid;
    case 'MOTION_BLOCKING_NO_LEAVES':
      return (cls.blocksMotion || cls.isFluid) && !cls.isLeaves;
  }
}

// Top-down scan: given a column of block ids, return the Y of the first
// qualifying block for the heightmap kind. Returns -1 if none.
export function topYForKind(kind: HeightmapKind, column: readonly string[]): number {
  for (let y = column.length - 1; y >= 0; y--) {
    const blockId = column[y] ?? 'webmc:air';
    const cls = classify(blockId);
    if (qualifies(kind, cls)) return y;
  }
  return -1;
}
