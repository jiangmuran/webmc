// Fence connects to adjacent solid blocks and other fences of same
// material family; does NOT connect across materials (wood ↔ nether brick).

export type FenceMaterial = 'wood' | 'nether_brick';

export interface FenceNeighbor {
  isSolid: boolean;
  fenceMaterial: FenceMaterial | null;
  isFenceGate: boolean;
  fenceGateFacing?: 'north' | 'south' | 'east' | 'west';
}

export function connectsTo(
  self: FenceMaterial,
  neighbor: FenceNeighbor,
  fromDir: 'north' | 'south' | 'east' | 'west',
): boolean {
  if (neighbor.isFenceGate) {
    return neighbor.fenceGateFacing === fromDir || neighbor.fenceGateFacing === opposite(fromDir);
  }
  if (neighbor.fenceMaterial !== null) return neighbor.fenceMaterial === self;
  return neighbor.isSolid;
}

function opposite(d: 'north' | 'south' | 'east' | 'west'): 'north' | 'south' | 'east' | 'west' {
  return d === 'north' ? 'south' : d === 'south' ? 'north' : d === 'east' ? 'west' : 'east';
}

export const FENCE_COLLISION_HEIGHT = 1.5;
