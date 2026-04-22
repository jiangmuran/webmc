// Torch placement. Torches attach to: full cube top, or side of full
// cube (wall torch variant), or the top of a fence post. They cannot
// attach to transparent blocks (glass), leaves, slabs (non-top), etc.

export type Face = 'top' | 'north' | 'south' | 'east' | 'west';

export interface SupportInfo {
  blockId: string;
  face: Face;
  faceIsFull: boolean;
}

const FULL_ALLOWED_OVERRIDE = new Set<string>([
  'webmc:fence',
  'webmc:oak_fence',
  'webmc:spruce_fence',
  'webmc:glass_pane',
]);

export function canAttach(s: SupportInfo): boolean {
  if (s.face === 'top' && FULL_ALLOWED_OVERRIDE.has(s.blockId)) return true;
  return s.faceIsFull;
}

export type TorchVariant = 'torch' | 'wall_torch';

export function variantFor(s: SupportInfo): TorchVariant {
  return s.face === 'top' ? 'torch' : 'wall_torch';
}

// Torch emits light level 14.
export const TORCH_EMISSION = 14;

// Redstone torch: 7 emission, powered by the block below.
export const REDSTONE_TORCH_EMISSION = 7;
export function redstoneTorchOutput(blockBelowPowered: boolean): number {
  return blockBelowPowered ? 0 : 15;
}
