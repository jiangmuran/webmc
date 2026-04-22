// Torch placement. A regular torch wants to sit on top of a solid block.
// If placed against a side of a solid block, becomes a wall torch with
// the appropriate facing. Soul torch / redstone torch share the same
// rules.

export type TorchVariant = 'torch' | 'soul_torch' | 'redstone_torch';
export type TorchFacing = 'floor' | 'north' | 'south' | 'east' | 'west';

export interface TorchPlaceQuery {
  clickedFace: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west';
  supportingBlockSolid: boolean;
}

export interface TorchPlaceResult {
  ok: boolean;
  facing: TorchFacing | null;
  blockId: string;
}

export function placeTorch(variant: TorchVariant, q: TorchPlaceQuery): TorchPlaceResult {
  if (!q.supportingBlockSolid) return { ok: false, facing: null, blockId: '' };
  if (q.clickedFace === 'bottom') return { ok: false, facing: null, blockId: '' };
  if (q.clickedFace === 'top') {
    return { ok: true, facing: 'floor', blockId: `webmc:${variant}` };
  }
  const facing = q.clickedFace;
  return {
    ok: true,
    facing,
    blockId: `webmc:wall_${variant}`,
  };
}

// Torches extinguish when their support is removed, dropping the torch
// item. Soul torches are also extinguished by water contact; regular
// torches break on water contact (no drop).
export function onSupportRemoved(variant: TorchVariant): { item: string; count: number }[] {
  return [{ item: `webmc:${variant}`, count: 1 }];
}

export function onWaterContact(variant: TorchVariant): { extinguished: boolean; dropped: boolean } {
  if (variant === 'soul_torch') return { extinguished: true, dropped: true };
  return { extinguished: true, dropped: false };
}

// Light emissions mirror the light_emission table.
export function torchLight(variant: TorchVariant): number {
  if (variant === 'soul_torch') return 10;
  if (variant === 'redstone_torch') return 7;
  return 14;
}
