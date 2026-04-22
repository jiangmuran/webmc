// Dispenser special behaviors. Some items, when dispensed, don't drop
// as entity but affect the world directly: shulker box places as block;
// bonemeal applies to the block in front; TNT primes; bucket picks
// up or places fluid.

export interface DispenseFront {
  blockId: string;
  isAir: boolean;
  isFluidSource: 'water' | 'lava' | null;
}

export type DispenseResult =
  | { kind: 'drop' }
  | { kind: 'activate' }
  | { kind: 'place_block'; blockId: string }
  | { kind: 'bonemeal_grow'; successChance: number }
  | { kind: 'bucket_fill'; fluid: 'water' | 'lava' }
  | { kind: 'bucket_empty'; fluid: 'water' | 'lava' };

export function specialBehavior(item: string, front: DispenseFront): DispenseResult {
  if (item.endsWith('_shulker_box') || item === 'webmc:shulker_box') {
    if (front.isAir) return { kind: 'place_block', blockId: item };
    return { kind: 'drop' };
  }
  if (item === 'webmc:bone_meal' && !front.isAir) {
    return { kind: 'bonemeal_grow', successChance: 0.45 };
  }
  if (item === 'webmc:water_bucket' && front.isAir) {
    return { kind: 'bucket_empty', fluid: 'water' };
  }
  if (item === 'webmc:lava_bucket' && front.isAir) {
    return { kind: 'bucket_empty', fluid: 'lava' };
  }
  if (item === 'webmc:bucket' && front.isFluidSource) {
    return { kind: 'bucket_fill', fluid: front.isFluidSource };
  }
  return { kind: 'drop' };
}
